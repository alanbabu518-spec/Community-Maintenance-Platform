import { maintenanceRepository } from "./maintenance.repository.js";
import type { UserRole } from "@prisma/client";
import type {
  CreateMaintenanceRequestInput,
  UpdateMaintenanceRequestInput,
  MaintenanceFilters,
} from "./maintenance.types.js";
import { userRepository } from "../users/user.repository.js";
import { AppError } from "../../utils/AppError.js";
import {
  toMaintenanceRequestResponse,
  toMaintenanceRequestDetailResponse,
} from "./maintenance.mapper.js";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload.js";
import { getCache, setCache, deleteCacheByPattern } from "../../utils/cache.js";
import { maintenanceListCacheKey } from "../../utils/cacheKeys.js";
import { notificationQueue } from "../../config/queue.js";

type MaintenanceNotification = {
  userId: number;
  type:
    | "MAINTENANCE_CREATED"
    | "TECHNICIAN_ASSIGNED"
    | "MAINTENANCE_STATUS_UPDATED";
  title: string;
  message: string;
};

async function queueMaintenanceNotifications(
  notifications: MaintenanceNotification[],
) {
  for (const notification of notifications) {
    await notificationQueue.add("maintenance-notification", notification);
  }
}

export const maintenanceService = {
  async createRequest(
    data: CreateMaintenanceRequestInput,
    residentId: number,
    files: Express.Multer.File[],
  ) {
    const request = await maintenanceRepository.create({
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      unitId: data.unitId,
      residentId,
    });

    for (const file of files) {
      const uploadedImage = await uploadToCloudinary(
        file.buffer,
        "community-maintenance",
      );

      await maintenanceRepository.createAttachment({
        maintenanceRequestId: request.id,
        fileUrl: uploadedImage.secure_url,
        fileName: file.originalname,
        fileType: file.mimetype,
      });
    }

    const requestWithAttachments = await maintenanceRepository.findById(
      request.id,
    );

    await deleteCacheByPattern("maintenance:list:*");

    if (!requestWithAttachments) {
      throw new Error("Maintenance request not found");
    }

    const communityId = requestWithAttachments.unit.building.communityId;

    const managersAndAdmins =
      await maintenanceRepository.findCommunityManagersAndAdmins(communityId);

    const notifications: MaintenanceNotification[] = [
      {
        userId: residentId,
        type: "MAINTENANCE_CREATED",
        title: requestWithAttachments.title,
        message: "Your maintenance request has been created.",
      },
      ...managersAndAdmins
        .filter((user) => user.id !== residentId)
        .map((user) => ({
          userId: user.id,
          type: "MAINTENANCE_CREATED" as const,
          title: requestWithAttachments.title,
          message: "A new maintenance request has been created.",
        })),
    ];

    await queueMaintenanceNotifications(notifications);

    return toMaintenanceRequestResponse(requestWithAttachments);
  },

  async getUnits() {
    return maintenanceRepository.findAllUnits();
  },

  async getRequests(
    userId: number,
    role: UserRole,
    page: number,
    limit: number,
    filters: MaintenanceFilters,
  ) {
    const cacheKey = maintenanceListCacheKey(
      role,
      userId,
      page,
      limit,
      filters,
    );

    const cachedResult = await getCache<{
      requests: ReturnType<typeof toMaintenanceRequestResponse>[];
      total: number;
    }>(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const skip = (page - 1) * limit;

    let result: {
      requests: any[];
      total: number;
    };

    if (role === "RESIDENT") {
      const [requests, total] = await Promise.all([
        maintenanceRepository.findByResidentId(userId, skip, limit, filters),
        maintenanceRepository.countByResidentId(userId, filters),
      ]);

      result = { requests, total };
    } else if (role === "TECHNICIAN") {
      const [requests, total] = await Promise.all([
        maintenanceRepository.findByTechnicianId(userId, skip, limit, filters),
        maintenanceRepository.countByTechnicianId(userId, filters),
      ]);

      result = { requests, total };
    } else if (role === "ADMIN" || role === "MANAGER") {
      const [requests, total] = await Promise.all([
        maintenanceRepository.findAll(skip, limit, filters),
        maintenanceRepository.countAll(filters),
      ]);

      result = { requests, total };
    } else {
      result = {
        requests: [],
        total: 0,
      };
    }

    const response = {
      requests: result.requests.map(toMaintenanceRequestResponse),
      total: result.total,
    };

    await setCache(cacheKey, response, 60);

    return response;
  },

  async getRequestById(id: number, userId: number, role: UserRole) {
    const request = await maintenanceRepository.findById(id);

    if (!request) {
      throw new AppError("Maintenance request not found", 404);
    }

    if (role === "ADMIN" || role === "MANAGER") {
      return toMaintenanceRequestDetailResponse(request);
    }

    if (role === "RESIDENT" && request.residentId === userId) {
      return toMaintenanceRequestDetailResponse(request);
    }

    if (role === "TECHNICIAN" && request.technicianId === userId) {
      return toMaintenanceRequestDetailResponse(request);
    }

    throw new AppError(
      "You are not authorized to access this maintenance request",
      403,
    );
  },

  async updateRequest(
    id: number,
    data: UpdateMaintenanceRequestInput,
    userId?: number,
    role?: UserRole,
  ) {
    const request = await maintenanceRepository.findById(id);

    if (!request) {
      return null;
    }

    if (
      role === "TECHNICIAN" &&
      userId !== undefined &&
      request.technicianId !== userId
    ) {
      throw new AppError(
        "You are not authorized to update this maintenance request",
        403,
      );
    }

    if (data.status) {
      const allowedTransitions: Record<string, string[]> = {
        OPEN: ["ACKNOWLEDGED"],
        ACKNOWLEDGED: ["ASSIGNED"],
        ASSIGNED: ["IN_PROGRESS"],
        IN_PROGRESS: ["RESOLVED"],
        RESOLVED: ["CLOSED"],
        CLOSED: [],
      };

      const allowedNextStatuses = allowedTransitions[request.status] ?? [];

      if (!allowedNextStatuses.includes(data.status)) {
        throw new AppError(
          `Invalid status transition: ${request.status} → ${data.status}`,
          400,
        );
      }
    }

    const updatedRequest = await maintenanceRepository.update(id, data);

    await deleteCacheByPattern("maintenance:list:*");

    if (data.status && data.status !== request.status) {
      const residentId = request.residentId;

      let message = "";

      switch (data.status) {
        case "ACKNOWLEDGED":
          message = "Your maintenance request has been acknowledged.";
          break;

        case "IN_PROGRESS":
          message = "Work has started on your maintenance request.";
          break;

        case "RESOLVED":
          message = "Your maintenance request has been completed.";
          break;

        case "CLOSED":
          message = "Your maintenance request has been closed.";
          break;

        default:
          message = `Your maintenance request status changed to ${data.status}.`;
      }

      await queueMaintenanceNotifications([
        {
          userId: residentId,
          type: "MAINTENANCE_STATUS_UPDATED",
          title: updatedRequest.title,
          message,
        },
      ]);
    }

    return toMaintenanceRequestResponse(updatedRequest);
  },

  async assignTechnician(requestId: number, technicianId: number) {
    const technician = await userRepository.findById(technicianId);

    if (!technician) {
      throw new AppError("Technician not found", 404);
    }

    if (technician.role !== "TECHNICIAN") {
      throw new AppError("User is not a technician", 400);
    }

    const request = await maintenanceRepository.findById(requestId);

    if (!request) {
      throw new AppError("Maintenance request not found", 404);
    }

    if (request.status !== "ACKNOWLEDGED") {
      throw new AppError(
        "Technician can only be assigned to an acknowledged request",
        400,
      );
    }

    const updatedRequest = await maintenanceRepository.update(requestId, {
      technicianId,
      status: "ASSIGNED",
    });

    await deleteCacheByPattern("maintenance:list:*");

    await queueMaintenanceNotifications([
      {
        userId: technicianId,
        type: "TECHNICIAN_ASSIGNED",
        title: updatedRequest.title,
        message: "A maintenance request has been assigned to you.",
      },
      {
        userId: request.residentId,
        type: "TECHNICIAN_ASSIGNED",
        title: updatedRequest.title,
        message: "A technician has been assigned to your maintenance request.",
      },
    ]);

    return toMaintenanceRequestResponse(updatedRequest);
  },
};

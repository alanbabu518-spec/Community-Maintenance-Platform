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

export const maintenanceService = {
  async createRequest(data: CreateMaintenanceRequestInput, residentId: number) {
    const request = await maintenanceRepository.create({
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      unitId: data.unitId,
      residentId,
    });

    return toMaintenanceRequestResponse(request);
  },

  async getRequests(
    userId: number,
    role: UserRole,
    page: number,
    limit: number,
    filters: MaintenanceFilters,
  ) {
    const skip = (page - 1) * limit;

    if (role === "RESIDENT") {
      const [requests, total] = await Promise.all([
        maintenanceRepository.findByResidentId(userId, skip, limit, filters),
        maintenanceRepository.countByResidentId(userId, filters),
      ]);

      return {
        requests: requests.map(toMaintenanceRequestResponse),
        total,
      };
    }

    if (role === "TECHNICIAN") {
      const [requests, total] = await Promise.all([
        maintenanceRepository.findByTechnicianId(userId, skip, limit, filters),
        maintenanceRepository.countByTechnicianId(userId, filters),
      ]);

      return {
        requests: requests.map(toMaintenanceRequestResponse),
        total,
      };
    }

    if (role === "ADMIN" || role === "MANAGER") {
      const [requests, total] = await Promise.all([
        maintenanceRepository.findAll(skip, limit, filters),
        maintenanceRepository.countAll(filters),
      ]);

      return {
        requests: requests.map(toMaintenanceRequestResponse),
        total,
      };
    }

    return {
      requests: [],
      total: 0,
    };
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

  async updateRequest(id: number, data: UpdateMaintenanceRequestInput) {
    const request = await maintenanceRepository.findById(id);

    if (!request) {
      return null;
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

    return toMaintenanceRequestResponse(updatedRequest);
  },
};

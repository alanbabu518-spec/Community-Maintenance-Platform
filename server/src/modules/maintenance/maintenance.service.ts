import { maintenanceRepository } from "./maintenance.repository.js";
import type { UserRole } from "@prisma/client";
import type {
  CreateMaintenanceRequestInput,
  UpdateMaintenanceRequestInput,
  MaintenanceFilters,
} from "./maintenance.types.js";
import { userRepository } from "../users/user.repository.js";

export const maintenanceService = {
  async createRequest(data: CreateMaintenanceRequestInput, residentId: number) {
    return maintenanceRepository.create({
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      unitId: data.unitId,
      residentId,
    });
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
        requests,
        total,
      };
    }

    if (role === "TECHNICIAN") {
      const [requests, total] = await Promise.all([
        maintenanceRepository.findByTechnicianId(userId, skip, limit, filters),
        maintenanceRepository.countByTechnicianId(userId, filters),
      ]);

      return {
        requests,
        total,
      };
    }

    if (role === "ADMIN" || role === "MANAGER") {
      const [requests, total] = await Promise.all([
        maintenanceRepository.findAll(skip, limit, filters),
        maintenanceRepository.countAll(filters),
      ]);

      return {
        requests,
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
      return null;
    }

    if (role === "ADMIN" || role === "MANAGER") {
      return request;
    }

    if (role === "RESIDENT" && request.residentId === userId) {
      return request;
    }

    if (role === "TECHNICIAN" && request.technicianId === userId) {
      return request;
    }

    return null;
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
        throw new Error(
          `Invalid status transition: ${request.status} → ${data.status}`,
        );
      }
    }

    return maintenanceRepository.update(id, data);
  },

  async assignTechnician(requestId: number, technicianId: number) {
    const technician = await userRepository.findById(technicianId);

    if (!technician) {
      throw new Error("Technician not found");
    }

    if (technician.role !== "TECHNICIAN") {
      throw new Error("User is not a technician");
    }

    const request = await maintenanceRepository.findById(requestId);

    if (!request) {
      throw new Error("Maintenance request not found");
    }

    if (request.status !== "ACKNOWLEDGED") {
      throw new Error(
        "Technician can only be assigned to an acknowledged request",
      );
    }

    return maintenanceRepository.update(requestId, {
      technicianId,
      status: "ASSIGNED",
    });
  },
};

import type { CreateMaintenanceRequestInput } from "./maintenance.types.js";
import { maintenanceRepository } from "./maintenance.repository.js";
import type { UserRole } from "@prisma/client";
import type { UpdateMaintenanceRequestInput } from "./maintenance.types.js";

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

  async getRequests(userId: number, role: UserRole) {
    if (role === "RESIDENT") {
      const requests = await maintenanceRepository.findAll();
      return requests.filter((request) => request.residentId === userId);
    }

    if (role === "ADMIN" || role === "MANAGER") {
      return maintenanceRepository.findAll();
    }

    return [];
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
};

import type { CreateMaintenanceRequestInput } from "./maintenance.types.js";
import { maintenanceRepository } from "./maintenance.repository.js";
import type { UserRole } from "@prisma/client";

export const maintenanceService = {
  async createRequest(
    data: CreateMaintenanceRequestInput,
    residentId: number
  ) {
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
};
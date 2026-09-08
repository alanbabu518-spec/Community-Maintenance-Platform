import { prisma } from "../../lib/prisma.js";
import type { UpdateMaintenanceRequestInput } from "./maintenance.types.js";

export const maintenanceRepository = {
  create(data: {
    title: string;
    description: string;
    category: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    residentId: number;
    unitId: number;
  }) {
    return prisma.maintenanceRequest.create({
      data,
    });
  },

  findAll() {
    return prisma.maintenanceRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findByResidentId(residentId: number) {
    return prisma.maintenanceRequest.findMany({
      where: {
        residentId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id: number) {
    return prisma.maintenanceRequest.findUnique({
      where: {
        id,
      },
      include: {
        resident: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        unit: {
          include: {
            building: {
              include: {
                community: true,
              },
            },
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  },
  update(id: number, data: UpdateMaintenanceRequestInput) {
    return prisma.maintenanceRequest.update({
      where: {
        id,
      },
      data: {
        ...(data.status !== undefined && { status: data.status }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.category !== undefined && { category: data.category }),
      },
    });
  },
};

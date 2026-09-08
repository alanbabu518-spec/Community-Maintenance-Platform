import { prisma } from "../../lib/prisma.js";
import type {
  UpdateMaintenanceRequestInput,
  MaintenanceFilters,
} from "./maintenance.types.js";

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

  findAll(skip: number, limit: number, filters: MaintenanceFilters) {
    return prisma.maintenanceRequest.findMany({
      where: {
        ...(filters.status !== undefined && {
          status: filters.status,
        }),

        ...(filters.priority !== undefined && {
          priority: filters.priority,
        }),

        ...(filters.category !== undefined && {
          category: filters.category,
        }),
      },

      skip,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  countAll(filters: MaintenanceFilters) {
    return prisma.maintenanceRequest.count({
      where: {
        ...(filters.status !== undefined && {
          status: filters.status,
        }),

        ...(filters.priority !== undefined && {
          priority: filters.priority,
        }),

        ...(filters.category !== undefined && {
          category: filters.category,
        }),
      },
    });
  },

  countByResidentId(residentId: number, filters: MaintenanceFilters) {
    return prisma.maintenanceRequest.count({
      where: {
        residentId,

        ...(filters.status !== undefined && {
          status: filters.status,
        }),

        ...(filters.priority !== undefined && {
          priority: filters.priority,
        }),

        ...(filters.category !== undefined && {
          category: filters.category,
        }),
      },
    });
  },

  countByTechnicianId(technicianId: number, filters: MaintenanceFilters) {
    return prisma.maintenanceRequest.count({
      where: {
        technicianId,

        ...(filters.status !== undefined && {
          status: filters.status,
        }),

        ...(filters.priority !== undefined && {
          priority: filters.priority,
        }),

        ...(filters.category !== undefined && {
          category: filters.category,
        }),
      },
    });
  },

  findByResidentId(
    residentId: number,
    skip: number,
    limit: number,
    filters: MaintenanceFilters,
  ) {
    return prisma.maintenanceRequest.findMany({
      where: {
        residentId,

        ...(filters.status !== undefined && {
          status: filters.status,
        }),

        ...(filters.priority !== undefined && {
          priority: filters.priority,
        }),

        ...(filters.category !== undefined && {
          category: filters.category,
        }),
      },

      skip,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findByTechnicianId(
    technicianId: number,
    skip: number,
    limit: number,
    filters: MaintenanceFilters,
  ) {
    return prisma.maintenanceRequest.findMany({
      where: {
        technicianId,

        ...(filters.status !== undefined && {
          status: filters.status,
        }),

        ...(filters.priority !== undefined && {
          priority: filters.priority,
        }),

        ...(filters.category !== undefined && {
          category: filters.category,
        }),
      },

      skip,
      take: limit,

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
        ...(data.technicianId !== undefined && {
          technicianId: data.technicianId,
        }),
      },
    });
  },
};

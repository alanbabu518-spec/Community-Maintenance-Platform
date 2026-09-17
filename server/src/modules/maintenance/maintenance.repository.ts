import { prisma } from "../../lib/prisma.js";
import type {
  UpdateMaintenanceRequestInput,
  MaintenanceFilters,
} from "./maintenance.types.js";

function buildMaintenanceWhere(
  filters: MaintenanceFilters,
  extraWhere: Record<string, unknown> = {},
) {
  return {
    ...extraWhere,

    ...(filters.search !== undefined &&
      filters.search !== "" && {
        OR: [
          {
            title: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
          {
            description: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),

    ...(filters.status !== undefined && {
      status: filters.status,
    }),

    ...(filters.priority !== undefined && {
      priority: filters.priority,
    }),

    ...(filters.category !== undefined && {
      category: filters.category,
    }),
  };
}

function buildMaintenanceOrderBy(filters: MaintenanceFilters) {
  return filters.sortBy === "priority"
    ? {
        priority: filters.sortOrder ?? "desc",
      }
    : {
        createdAt: filters.sortOrder ?? "desc",
      };
}

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

  findAllUnits() {
    return prisma.unit.findMany({
      orderBy: {
        unitNumber: "asc",
      },
    });
  },

  findAll(skip: number, limit: number, filters: MaintenanceFilters) {
    return prisma.maintenanceRequest.findMany({
      where: buildMaintenanceWhere(filters),
      skip,
      take: limit,
      orderBy: buildMaintenanceOrderBy(filters),
    });
  },

  countAll(filters: MaintenanceFilters) {
    return prisma.maintenanceRequest.count({
      where: buildMaintenanceWhere(filters),
    });
  },

  countByResidentId(
    residentId: number,
    filters: MaintenanceFilters,
  ) {
    return prisma.maintenanceRequest.count({
      where: buildMaintenanceWhere(filters, {
        residentId,
      }),
    });
  },

  countByTechnicianId(
    technicianId: number,
    filters: MaintenanceFilters,
  ) {
    return prisma.maintenanceRequest.count({
      where: buildMaintenanceWhere(filters, {
        technicianId,
      }),
    });
  },

  findByResidentId(
    residentId: number,
    skip: number,
    limit: number,
    filters: MaintenanceFilters,
  ) {
    return prisma.maintenanceRequest.findMany({
      where: buildMaintenanceWhere(filters, {
        residentId,
      }),
      skip,
      take: limit,
      orderBy: buildMaintenanceOrderBy(filters),
    });
  },

  findByTechnicianId(
    technicianId: number,
    skip: number,
    limit: number,
    filters: MaintenanceFilters,
  ) {
    return prisma.maintenanceRequest.findMany({
      where: buildMaintenanceWhere(filters, {
        technicianId,
      }),
      skip,
      take: limit,
      orderBy: buildMaintenanceOrderBy(filters),
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
        maintenanceAttachments: true,
      },
    });
  },

  update(id: number, data: UpdateMaintenanceRequestInput) {
    return prisma.maintenanceRequest.update({
      where: {
        id,
      },
      data: {
        ...(data.status !== undefined && {
          status: data.status,
        }),
        ...(data.priority !== undefined && {
          priority: data.priority,
        }),
        ...(data.category !== undefined && {
          category: data.category,
        }),
        ...(data.technicianId !== undefined && {
          technicianId: data.technicianId,
        }),
      },
    });
  },

  createAttachment(data: {
    maintenanceRequestId: number;
    fileUrl: string;
    fileName: string;
    fileType: string;
  }) {
    return prisma.maintenanceAttachment.create({
      data,
    });
  },
};
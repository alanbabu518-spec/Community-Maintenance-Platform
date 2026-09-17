import { prisma } from "../../lib/prisma.js";

export const countTotalRequests = async (
  userId: number,
  role: string
) => {
  if (role === "RESIDENT") {
    return prisma.maintenanceRequest.count({
      where: {
        residentId: userId,
      },
    });
  }

  if (role === "TECHNICIAN") {
    return prisma.maintenanceRequest.count({
      where: {
        technicianId: userId,
      },
    });
  }

  return prisma.maintenanceRequest.count();
};

export const countOpenRequests = async (
  userId: number,
  role: string
) => {
  const where: any = {
    status: "OPEN",
  };

  if (role === "RESIDENT") {
    where.residentId = userId;
  }

  if (role === "TECHNICIAN") {
    where.technicianId = userId;
  }

  return prisma.maintenanceRequest.count({ where });
};

export const countAssignedRequests = async (
  userId: number,
  role: string
) => {
  const where: any = {
    status: "ASSIGNED",
  };

  if (role === "RESIDENT") {
    where.residentId = userId;
  }

  if (role === "TECHNICIAN") {
    where.technicianId = userId;
  }

  return prisma.maintenanceRequest.count({ where });
};

export const countResolvedRequests = async (
  userId: number,
  role: string
) => {
  const where: any = {
    status: "RESOLVED",
  };

  if (role === "RESIDENT") {
    where.residentId = userId;
  }

  if (role === "TECHNICIAN") {
    where.technicianId = userId;
  }

  return prisma.maintenanceRequest.count({ where });
};
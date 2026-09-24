import { prisma } from "../../lib/prisma.js";

export const countResidents = () => {
  return prisma.user.count({
    where: {
      role: "RESIDENT",
    },
  });
};

export const countStaff = () => {
  return prisma.user.count({
    where: {
      role: {
        in: ["ADMIN", "MANAGER", "TECHNICIAN"],
      },
    },
  });
};

export const countOpenRequests = () => {
  return prisma.maintenanceRequest.count({
    where: {
      status: "OPEN",
    },
  });
};

export const countActiveCommunities = () => {
  return prisma.community.count({
    where: {
      users: {
        some: {},
      },
    },
  });
};

export const countRequestsByStatus = (
  status: "ACKNOWLEDGED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED",
) => {
  return prisma.maintenanceRequest.count({
    where: {
      status,
    },
  });
};

export const countUrgentRequests = () => {
  return prisma.maintenanceRequest.count({
    where: {
      priority: "URGENT",
    },
  });
};

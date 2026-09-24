import { prisma } from "../../lib/prisma.js";

export const countCommunityRequests = (communityId: number) => {
  return prisma.maintenanceRequest.count({
    where: {
      unit: {
        building: {
          communityId,
        },
      },
    },
  });
};

export const countCommunityRequestsByStatus = (
  communityId: number,
  status:
    | "OPEN"
    | "ACKNOWLEDGED"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED",
) => {
  return prisma.maintenanceRequest.count({
    where: {
      status,
      unit: {
        building: {
          communityId,
        },
      },
    },
  });
};

export const countCommunityUrgentRequests = (communityId: number) => {
  return prisma.maintenanceRequest.count({
    where: {
      priority: "URGENT",
      unit: {
        building: {
          communityId,
        },
      },
    },
  });
};

export const getRecentCommunityRequests = (
  communityId: number,
  limit = 5,
) => {
  return prisma.maintenanceRequest.findMany({
    where: {
      unit: {
        building: {
          communityId,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    include: {
      resident: {
        select: {
          id: true,
          name: true,
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
        },
      },
    },
  });
};

export const getCommunityTechnicians = (communityId: number) => {
  return prisma.user.findMany({
    where: {
      role: "TECHNICIAN",
      communityId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};
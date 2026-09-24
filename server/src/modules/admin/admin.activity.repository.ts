import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

export const getRecentActivity = async (limit: number = 10) => {
  return prisma.activityLog.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });
};

export const createActivityLog = async (data: {
  actorId: number;
  action: string;
  entity: string;
  entityId?: number;
  metadata?: Prisma.InputJsonValue;
}) => {
  return prisma.activityLog.create({
    data: {
      actorId: data.actorId,
      action: data.action,
      entity: data.entity,
      ...(data.entityId !== undefined && {
        entityId: data.entityId,
      }),
      ...(data.metadata !== undefined && {
        metadata: data.metadata,
      }),
    },
  });
};

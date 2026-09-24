import { getRecentActivity } from "./admin.activity.repository.js";
import type { AdminActivityResponse } from "./admin.activity.types.js";
import { createActivityLog } from "./admin.activity.repository.js";

export const getAdminRecentActivity = async (
  limit: number = 10,
): Promise<AdminActivityResponse[]> => {
  const activities = await getRecentActivity(limit);

  return activities.map((activity) => ({
    id: activity.id,
    action: activity.action,
    entity: activity.entity,
    entityId: activity.entityId,
    metadata: activity.metadata,
    createdAt: activity.createdAt,
    actor: {
      id: activity.actor.id,
      name: activity.actor.name,
      role: activity.actor.role,
    },
  }));
};

export const logAdminActivity = async (data: {
  actorId: number;
  action: string;
  entity: string;
  entityId?: number;
  metadata?: import("@prisma/client").Prisma.InputJsonValue;
}) => {
  return createActivityLog(data);
};

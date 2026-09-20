import {prisma} from "../../lib/prisma.js";

export const getOrCreatePreferences = async (userId: number) => {
  return prisma.notificationPreference.upsert({
    where: {
      userId,
    },
    update: {},
    create: {
      userId,
    },
  });
};

export const updatePreferences = async (
  userId: number,
  data: {
    pushEnabled?: boolean;
    announcements?: boolean;
    maintenance?: boolean;
  }
) => {
  const updateData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );

  return prisma.notificationPreference.upsert({
    where: {
      userId,
    },
    update: updateData,
    create: {
      userId,
      ...updateData,
    },
  });
};
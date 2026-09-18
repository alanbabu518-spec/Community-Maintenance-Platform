import { prisma } from "../../lib/prisma.js";

export async function createNotification(data: {
  userId: number;
  type: string;
  title: string;
  message: string;
}) {
  return prisma.notification.create({
    data,
  });
}

export async function getUserNotifications(
  userId: number,
  page: number,
  limit: number,
) {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.notification.count({
      where: { userId },
    }),
  ]);

  return {
    notifications,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function markNotificationAsRead(
  notificationId: number,
  userId: number,
) {
  return prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}
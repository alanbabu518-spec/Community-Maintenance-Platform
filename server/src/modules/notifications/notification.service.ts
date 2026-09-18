import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
} from "./notification.repository.js";

export async function createUserNotification(data: {
  userId: number;
  type: string;
  title: string;
  message: string;
}) {
  return createNotification(data);
}

export async function getNotifications(
  userId: number,
  page: number,
  limit: number,
) {
  return getUserNotifications(userId, page, limit);
}

export async function markAsRead(
  notificationId: number,
  userId: number,
) {
  return markNotificationAsRead(notificationId, userId);
}
import apiClient  from "./apiClient";

export interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getNotifications(
  page = 1,
  limit = 10,
): Promise<NotificationResponse> {
  return apiClient(
    `/notifications?page=${page}&limit=${limit}`,
  );
}

export async function markNotificationAsRead(
  notificationId: number,
) {
  return apiClient(`/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
}
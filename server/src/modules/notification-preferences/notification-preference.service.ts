import {
  getOrCreatePreferences,
  updatePreferences,
} from "./notification-preference.repository.js";

export const getNotificationPreferences = async (userId: number) => {
  return getOrCreatePreferences(userId);
};

export const updateNotificationPreferences = async (
  userId: number,
  data: {
    pushEnabled?: boolean | undefined;
    announcements?: boolean | undefined;
    maintenance?: boolean | undefined;
  }
) => {
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );

  return updatePreferences(userId, cleanData);
};
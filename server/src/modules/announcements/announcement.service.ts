import {
  createAnnouncement,
  getCommunityAnnouncements,
} from "./announcement.repository.js";
import { emitToCommunity } from "../../config/socket.js";
import { getCommunityUserIds } from "./announcement.repository.js";
import { sendPushNotification } from "../notifications/push.sender.js";

export async function createCommunityAnnouncement(data: {
  communityId: number;
  title: string;
  message: string;
  category: string;
  priority: string;
  author: string;
}) {
  const announcement = await createAnnouncement(data);

  emitToCommunity(data.communityId, "announcement:new", announcement);

  const userIds = await getCommunityUserIds(data.communityId);

  for (const userId of userIds) {
    await sendPushNotification(userId, {
      title: announcement.title,
      message: announcement.message,
    });
  }

  return announcement;
}

export async function getAnnouncements(
  communityId: number,
  page: number,
  limit: number,
) {
  return getCommunityAnnouncements(communityId, page, limit);
}

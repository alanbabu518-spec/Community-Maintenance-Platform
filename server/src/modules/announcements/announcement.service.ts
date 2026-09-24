import {
  createAnnouncement,
  getCommunityAnnouncements,
  getAnnouncementById,
} from "./announcement.repository.js";
import { emitToCommunity } from "../../config/socket.js";
import { notificationQueue } from "../../config/queue.js";

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

  await notificationQueue.add("announcement-created", {
    communityId: data.communityId,
    title: announcement.title,
    message: announcement.message,
  });

  return announcement;
}

export async function getAnnouncements(
  communityId: number,
  page: number,
  limit: number,
) {
  return getCommunityAnnouncements(communityId, page, limit);
}

export async function getAnnouncement(announcementId: number) {
  return getAnnouncementById(announcementId);
}

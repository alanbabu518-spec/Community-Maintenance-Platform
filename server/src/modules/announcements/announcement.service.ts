import {
  createAnnouncement,
  getCommunityAnnouncements,
} from "./announcement.repository.js";

export async function createCommunityAnnouncement(data: {
  communityId: number;
  title: string;
  message: string;
}) {
  return createAnnouncement(data);
}

export async function getAnnouncements(
  communityId: number,
  page: number,
  limit: number,
) {
  return getCommunityAnnouncements(communityId, page, limit);
}
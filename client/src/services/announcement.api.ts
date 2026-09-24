import apiClient from "./apiClient";

export interface Announcement {
  id: number;
  communityId: number;
  title: string;
  message: string;
  category: "General" | "Maintenance" | "Event" | "Emergency";
  priority: "Low" | "Medium" | "High";
  author: string;
  createdAt: string;
  updatedAt: string;
}

interface AnnouncementResponse {
  announcements: Announcement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getAnnouncements(
  communityId: number,
  page = 1,
  limit = 10,
): Promise<AnnouncementResponse> {
  return apiClient(
    `/announcements?communityId=${communityId}&page=${page}&limit=${limit}`,
  );
}

export async function getAnnouncement(
  announcementId: number,
): Promise<Announcement> {
  return apiClient<Announcement>(`/announcements/${announcementId}`);
}

export async function createAnnouncement(data: {
  title: string;
  message: string;
  category: "General" | "Maintenance" | "Event" | "Emergency";
  priority: "Low" | "Medium" | "High";
}): Promise<Announcement> {
  return apiClient<Announcement>("/announcements", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export default getAnnouncements;

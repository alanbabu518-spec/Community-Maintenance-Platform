export type StoredAnnouncement = {
  id: string;
  title: string;
  content: string;
  category: "General" | "Maintenance" | "Event" | "Emergency";
  priority: "Low" | "Medium" | "High";
  author: string;
  date: string;
};

const STORAGE_KEY = "communitycare_announcements";
const ANNOUNCEMENT_EVENT = "communitycare:announcements-updated";

const defaultAnnouncements: StoredAnnouncement[] = [
  {
    id: "1",
    title: "Monthly Maintenance Payment Due",
    content: "Please complete your monthly maintenance payment before the due date.",
    category: "General",
    priority: "High",
    author: "Community Manager",
    date: "2026-09-15",
  },
  {
    id: "2",
    title: "Water Tank Cleaning",
    content: "Water tank cleaning will be carried out this weekend.",
    category: "Maintenance",
    priority: "Medium",
    author: "Maintenance Team",
    date: "2026-09-14",
  },
  {
    id: "3",
    title: "Community Meeting",
    content: "The monthly community meeting will be held in the common hall.",
    category: "Event",
    priority: "Medium",
    author: "Community Manager",
    date: "2026-09-12",
  },
  {
    id: "4",
    title: "Parking Area Maintenance",
    content: "The parking area will be temporarily unavailable during maintenance.",
    category: "Maintenance",
    priority: "Low",
    author: "Maintenance Team",
    date: "2026-09-10",
  },
  {
    id: "5",
    title: "Security Notice",
    content: "Residents are requested to ensure that the main entrance remains closed.",
    category: "General",
    priority: "High",
    author: "Security Team",
    date: "2026-09-08",
  },
  {
    id: "6",
    title: "Emergency Contact Update",
    content: "Emergency contact information has been updated for all residents.",
    category: "Emergency",
    priority: "High",
    author: "Community Manager",
    date: "2026-09-06",
  },
];

export function getAnnouncements(): StoredAnnouncement[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAnnouncements));
    return defaultAnnouncements;
  }

  try {
    return JSON.parse(stored) as StoredAnnouncement[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAnnouncements));
    return defaultAnnouncements;
  }
}

export function addAnnouncement(announcement: StoredAnnouncement) {
  const announcements = getAnnouncements();
  const updatedAnnouncements = [announcement, ...announcements];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedAnnouncements),
  );

  window.dispatchEvent(new Event(ANNOUNCEMENT_EVENT));
}

export function getAnnouncementCount() {
  return getAnnouncements().length;
}

export function getAnnouncementEventName() {
  return ANNOUNCEMENT_EVENT;
}
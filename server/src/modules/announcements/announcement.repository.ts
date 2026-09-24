import { prisma } from "../../lib/prisma.js";

export async function createAnnouncement(data: {
  communityId: number;
  title: string;
  message: string;
  category: string;
  priority: string;
  author: string;
}) {
  return prisma.announcement.create({
    data,
  });
}

export async function getCommunityAnnouncements(
  communityId: number,
  page: number,
  limit: number,
) {
  const skip = (page - 1) * limit;

  const [announcements, total] = await Promise.all([
    prisma.announcement.findMany({
      where: { communityId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),

    prisma.announcement.count({
      where: { communityId },
    }),
  ]);

  return {
    announcements,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAnnouncementById(announcementId: number) {
  return prisma.announcement.findUnique({
    where: {
      id: announcementId,
    },
  });
}

export async function getCommunityUserIds(communityId: number) {
  const users = await prisma.user.findMany({
    where: {
      unit: {
        building: {
          communityId,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return users.map((user) => user.id);
}

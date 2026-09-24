import type { UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import type { UserFilters } from "./user.types.js";

export const userRepository = {
  async findAll(filters: UserFilters) {
    const skip = (filters.page - 1) * filters.limit;

    const where = {
      ...(filters.search
        ? {
            OR: [
              {
                name: {
                  contains: filters.search,
                  mode: "insensitive" as const,
                },
              },
              {
                email: {
                  contains: filters.search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),

      ...(filters.role
        ? {
            role: filters.role,
          }
        : {}),

      ...(filters.communityId
        ? {
            communityId: filters.communityId,
          }
        : {}),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          communityId: true,
          unitId: true,
          createdAt: true,
          updatedAt: true,
          unit: {
            select: {
              unitNumber: true,
              building: {
                select: {
                  communityId: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: filters.sortOrder,
        },
        skip,
        take: filters.limit,
      }),

      prisma.user.count({
        where,
      }),
    ]);

    return {
      users,
      total,
    };
  },

  create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    googleId?: string;
    emailVerified?: boolean;
    unitId?: number;
    communityId?: number;
  }) {
    return prisma.user.create({
      data,
    });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  findByGoogleId(googleId: string) {
    return prisma.user.findUnique({
      where: {
        googleId,
      },
    });
  },

  updateGoogleId(userId: number, googleId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        googleId,
      },
    });
  },

  findById(id: number) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        unit: {
          include: {
            building: true,
          },
        },
      },
    });
  },

  findCommunityById(communityId: number) {
    return prisma.community.findUnique({
      where: {
        id: communityId,
      },
      select: {
        id: true,
      },
    });
  },

  updateVerificationStatus(id: number, emailVerified: boolean) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        emailVerified,
      },
    });
  },

  async updatePassword(userId: number, passwordHash: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
      },
    });
  },

  async incrementTokenVersion(userId: number) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
    });
  },
  async updateActiveStatus(userId: number, isActive: boolean) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isActive,
        tokenVersion: {
          increment: 1,
        },
      },
    });
  },
  async findTechnicians(communityId?: number) {
    return prisma.user.findMany({
      where: {
        role: "TECHNICIAN",
        isActive: true,
        ...(communityId !== undefined
          ? {
              communityId,
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        communityId: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  },
};

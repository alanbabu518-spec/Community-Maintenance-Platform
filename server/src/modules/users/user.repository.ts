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
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          unit: {
            select: {
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
    role: "RESIDENT" | "ADMIN" | "MANAGER" | "TECHNICIAN";
  }) {
    return prisma.user.create({ data });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            building: true,
          },
        },
      },
    });
  },

  updateVerificationStatus(id: number, emailVerified: boolean) {
    return prisma.user.update({
      where: { id },
      data: { emailVerified },
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
};

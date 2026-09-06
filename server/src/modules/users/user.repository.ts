import { prisma } from "../../lib/prisma.js";

export const userRepository = {
  findAll() {
    return prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: "RESIDENT" | "ADMIN" | "MANAGER" | "TECHNICIAN";
  }) {
    return prisma.user.create({
      data,
    });
  },
};
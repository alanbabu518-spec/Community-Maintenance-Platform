import { prisma } from "../../lib/prisma.js";

export const userRepository = {
  findAll() {
    return prisma.user.findMany({
      select:  {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
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

  findByEmail(email: string){
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  findById(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
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

};

import { prisma } from "../../lib/prisma.js";

export const maintenanceRepository = {
  create(data: {
    title: string;
    description: string;
    category: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    residentId: number;
    unitId: number;
  }) {
    return prisma.maintenanceRequest.create({
      data,
    });
  },
  findAll() {
  return prisma.maintenanceRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
},
};

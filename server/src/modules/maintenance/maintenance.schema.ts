import { z } from "zod"

export const createMaintenanceRequestSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    category: z.string().min(3),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
    unitId: z.number().int().positive(),
});

export const updateMaintenanceRequestSchema = z.object({
  status: z.enum([
    "OPEN",
    "ACKNOWLEDGED",
    "ASSIGNED",
    "IN_PROGRESS",
    "RESOLVED",
    "CLOSED",
  ]).optional(),

  priority: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "URGENT",
  ]).optional(),

  category: z.string().min(2).optional(),
});

export const assignTechnicianSchema = z.object({
  technicianId: z.number().int().positive(),
});
import { z } from "zod";

export const createMaintenanceRequestSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().trim().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  unitId: z.coerce.number().int().positive(),
});

export const updateMaintenanceRequestSchema = z.object({
  status: z
    .enum([
      "OPEN",
      "ACKNOWLEDGED",
      "ASSIGNED",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
    ])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  category: z.string().trim().min(1).optional(),
});

export const assignTechnicianSchema = z.object({
  technicianId: z.coerce.number().int().positive(),
});

export const maintenanceQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().optional(),

  status: z
    .enum([
      "OPEN",
      "ACKNOWLEDGED",
      "ASSIGNED",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
    ])
    .optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),

  category: z.string().trim().min(1).optional(),

  sortBy: z.enum(["createdAt", "priority"]).default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

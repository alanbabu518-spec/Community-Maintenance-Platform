import { z } from "zod"

export const createMaintenanceRequestSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    category: z.string().min(3),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
    unitId: z.number().int().positive(),
});
import { z } from "zod";

export const createStaffSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["MANAGER", "TECHNICIAN"]),
});

export const userQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  role: z
    .enum(["ADMIN", "MANAGER", "RESIDENT", "TECHNICIAN"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
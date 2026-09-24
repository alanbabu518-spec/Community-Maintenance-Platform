import { z } from "zod";

export const createStaffSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["MANAGER", "TECHNICIAN"]),
  communityId: z.coerce.number().int().positive(),
});

export const userQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  role: z.enum(["ADMIN", "MANAGER", "RESIDENT", "TECHNICIAN"]).optional(),
  communityId: z.coerce.number().int().positive().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

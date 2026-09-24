import { z } from "zod";

export const createCommunitySchema = z.object({
  name: z.string().trim().min(2).max(100),
  address: z.string().trim().min(5).max(255),
});

export const createBuildingSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export const createUnitSchema = z.object({
  unitNumber: z.string().trim().min(1).max(50),
});

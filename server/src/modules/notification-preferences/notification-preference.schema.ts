import { z } from "zod";

export const updateNotificationPreferenceSchema = z
  .object({
    pushEnabled: z.boolean().optional(),
    announcements: z.boolean().optional(),
    maintenance: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one preference must be provided",
  });

export type UpdateNotificationPreferenceInput = z.infer<
  typeof updateNotificationPreferenceSchema
>;
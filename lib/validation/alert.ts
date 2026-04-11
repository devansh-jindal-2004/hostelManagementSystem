import { z } from "zod";

export const createAlertSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Message content is required"),
  type: z.enum(['info', 'alert', 'success']).default('info'),
  targetAudience: z.enum(['all', 'students', 'staff']).default('all'),
});
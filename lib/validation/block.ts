import { z } from "zod";

export const createBlockSchema = z.object({
    name: z
        .string()
        .min(2, "Block name must be at least 2 characters")
        .max(50)
        .trim(),
    type: z.enum(["Boys", "Girls"]),
    warden: z.string().min(1, "Warden ID is required"),
});
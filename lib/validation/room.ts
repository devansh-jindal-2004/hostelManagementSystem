import { z } from "zod";

export const createRoomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required").trim(),
  block: z.string().min(1, "Block ID is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  students: z.array(z.string()).optional().default([]),
});
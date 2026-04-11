import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters").default("Welcome1"),
  role: z.enum(["admin", "warden", "student"]).default("student"),
  gender: z.enum(["male", "female", "other"]).default("male"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),

  // Academic info made optional but validated if present
  registrationNumber: z.string().trim().optional(),
  department: z.string().trim().optional(),
  academicYear: z.string().trim().optional(),
  amountDue: z.number().min(0).default(0)
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  otp: z.string().length(4, "OTP must be 4 digits"),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  email: z.string().email().toLowerCase().trim(),
  phoneNumber: z.string().trim().min(10),
  gender: z.enum(["male", "female", "other"]),
  registrationNumber: z.string().trim(),
  department: z.string().trim(),
  academicYear: z.string().trim(),
  emergencyContact: z.object({
    name: z.string().trim().default(""),
    relationship: z.string().trim().default(""),
    phone: z.string().trim().default("")
  })
});
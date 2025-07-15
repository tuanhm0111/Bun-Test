import { z } from "zod";

// Base validation schemas
const baseSchemas = {
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a positive integer")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, { message: "ID must be > 0" }),

  email: z.string().email("Invalid email format"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatar: z.string().url().optional(),
  isActive: z.boolean(),
};

// User validation schemas
export const userSchemas = {
  // Params validation
  params: z.object({
    id: baseSchemas.id,
  }),

  // Create user validation
  create: z.object({
    email: baseSchemas.email,
    username: baseSchemas.username,
    firstName: baseSchemas.firstName,
    lastName: baseSchemas.lastName,
    password: baseSchemas.password,
    avatar: baseSchemas.avatar,
    isActive: baseSchemas.isActive.optional().default(true),
  }),

  // Update user validation
  update: z.object({
    email: baseSchemas.email.optional(),
    username: baseSchemas.username.optional(),
    firstName: baseSchemas.firstName.optional(),
    lastName: baseSchemas.lastName.optional(),
    password: baseSchemas.password.optional(),
    avatar: baseSchemas.avatar,
    isActive: baseSchemas.isActive.optional(),
  }),

  // Query parameters validation
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    sortBy: z.enum(["id", "email", "username", "firstName", "lastName", "createdAt", "updatedAt"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),

  // Update user status validation
  status: z.object({
    isActive: baseSchemas.isActive,
  }),

  // Change password validation
  changePassword: z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: baseSchemas.password,
  }),
};
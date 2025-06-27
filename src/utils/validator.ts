import { z } from "zod";

// User params schema
export const userParamsSchema = z.object({
  id: z
  .string()
  .regex(/^\d+$/, "ID must be a positive integer")
  .transform((val) => parseInt(val, 10))
  .refine((val) => val > 0, { message: "ID must be > 0" })
});

// Create user schema
export const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatar: z.string().url().optional(),
  isActive: z.boolean().optional().default(true),
});

// Update user schema
export const updateUserSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  avatar: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

// Get users query schema
export const getUsersQuerySchema = z.object({
  page: z.string().regex(/^\d+$/, "Page must be a positive integer").optional(),
  limit: z.string().regex(/^\d+$/, "Limit must be a positive integer").optional(),
  search: z.string().optional(),
  sortBy: z.enum(["id", "email", "username", "firstName", "lastName", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Update user status schema
export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});

// Change password schema
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

// Type exports
export type UserParamsType = z.infer<typeof userParamsSchema>;
export type CreateUserType = z.infer<typeof createUserSchema>;
export type UpdateUserType = z.infer<typeof updateUserSchema>;
export type GetUsersQueryType = z.infer<typeof getUsersQuerySchema>;
export type UpdateUserStatusType = z.infer<typeof updateUserStatusSchema>;
export type ChangePasswordType = z.infer<typeof changePasswordSchema>;
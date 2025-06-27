import prisma from "../config/database";
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserResponse,
} from "../types/user.types";
import type { PaginatedResponse, PaginationParams } from "../types/common.type";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AppError } from "../utils/appError";
import { HttpStatusCode } from "../utils/constants";
import bcrypt from "bcrypt";

export class UserService {
  private readonly userSelect = {
    id: true,
    email: true,
    username: true,
    firstName: true,
    lastName: true,
    avatar: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };

  normalizeUser = (user: any): UserResponse => ({
    ...user,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    avatar: user.avatar ?? undefined,
  });

  async create(data: CreateUserDto): Promise<UserResponse> {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      const user = await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
        select: this.userSelect,
      });

      return this.normalizeUser(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new AppError(
            "Email or username already exists",
            HttpStatusCode.CONFLICT
          );
        }
      }
      throw new AppError(
        "Failed to create user",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(
    params: PaginationParams
  ): Promise<PaginatedResponse<UserResponse>> {
    try {
      const { page, limit, sortBy, sortOrder, filters } = params;
      const skip = (page - 1) * limit;

      // Validate sortBy field
      const allowedSortFields = [
        "id",
        "email",
        "username",
        "firstName",
        "lastName",
        "createdAt",
        "updatedAt",
      ];
      const validSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

      // Build where clause
      const where: any = {};

      if (filters?.search) {
        where.OR = [
          { email: { contains: filters.search, mode: "insensitive" } },
          { username: { contains: filters.search, mode: "insensitive" } },
          { firstName: { contains: filters.search, mode: "insensitive" } },
          { lastName: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      // Get total count
      const total = await prisma.user.count({ where });

      // Get users
      const users = await prisma.user.findMany({
        where,
        select: this.userSelect,
        skip,
        take: limit,
        orderBy: {
          [validSortBy]: sortOrder,
        },
      });

      const totalPages = Math.ceil(total / limit);

      return {
        data: users.map((user) => this.normalizeUser(user)),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("Error in findAll:", error);
      throw new AppError(
        "Failed to fetch users",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findById(id: number): Promise<UserResponse | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: this.userSelect,
      });

      if (!user) {
        return null;
      }

      return this.normalizeUser(user);
    } catch (error) {
      console.error("Error in findById:", error);
      throw new AppError(
        "Failed to fetch user",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    try {
      if (!email) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email },
        select: this.userSelect,
      });

      if (!user) {
        return null;
      }

      return this.normalizeUser(user);
    } catch (error) {
      console.error("Error in findByEmail:", error);
      throw new AppError(
        "Failed to fetch user by email",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByUsername(username: string): Promise<UserResponse | null> {
    try {
      if (!username) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { username },
        select: this.userSelect,
      });

      if (!user) {
        return null;
      }

      return this.normalizeUser(user);
    } catch (error) {
      console.error("Error in findByUsername:", error);
      throw new AppError(
        "Failed to fetch user by username",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: number, data: UpdateUserDto): Promise<UserResponse | null> {
    try {
      // Create update data object
      const updateData: any = { ...data };

      // If password is being updated, hash it
      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 12);
      }

      // Always update the updatedAt field
      updateData.updatedAt = new Date();

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: this.userSelect,
      });

      if (!user) {
        return null;
      }

      return this.normalizeUser(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new AppError(
            "Email or username already exists",
            HttpStatusCode.CONFLICT
          );
        }
        if (error.code === "P2025") {
          throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
        }
      }
      if (error instanceof AppError) {
        throw error;
      }
      console.error("Error in update:", error);
      throw new AppError(
        "Failed to update user",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
        }
      }
      if (error instanceof AppError) {
        throw error;
      }
      console.error("Error in delete:", error);
      throw new AppError(
        "Failed to delete user",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateStatus(
    id: number,
    isActive: boolean
  ): Promise<UserResponse | null> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          isActive,
          updatedAt: new Date(),
        },
        select: this.userSelect,
      });

      if (!user) {
        return null;
      }

      return this.normalizeUser(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
        }
      }
      if (error instanceof AppError) {
        throw error;
      }
      console.error("Error in updateStatus:", error);
      throw new AppError(
        "Failed to update user status",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getProfile(id: number): Promise<UserResponse | null> {
    try {
      if (!id || id <= 0) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          ...this.userSelect,
          // Add any additional profile fields here
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
      });

      if (!user) {
        return null;
      }

      return this.normalizeUser(user);
    } catch (error) {
      console.error("Error in getProfile:", error);
      throw new AppError(
        "Failed to fetch user profile",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async verifyPassword(
    email: string,
    password: string
  ): Promise<UserResponse | null> {
    try {
      if (!email || !password) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          ...this.userSelect,
          password: true,
        },
      });

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return this.normalizeUser(userWithoutPassword);
    } catch (error) {
      console.error("Error in verifyPassword:", error);
      throw new AppError(
        "Failed to verify password",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async changePassword(
    id: number,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { password: true },
      });

      if (!user) {
        throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
      }

      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isOldPasswordValid) {
        throw new AppError("Invalid old password", HttpStatusCode.BAD_REQUEST);
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id },
        data: {
          password: hashedNewPassword,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error("Error in changePassword:", error);
      throw new AppError(
        "Failed to change password",
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}

// Export instance for dependency injection
export const userService = new UserService();

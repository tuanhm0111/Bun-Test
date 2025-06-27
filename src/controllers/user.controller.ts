import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import type {
  CreateUserDto,
  UpdateUserDto,
  UserResponse,
} from "../types/user.types";
import type {
  ApiResponse,
  PaginatedResponse,
  QueryFilters,
} from "../types/common.type";
import { AppError } from "../utils/appError";
import { HttpStatusCode } from "../utils/constants";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // GET /users - Get all users with pagination and filtering
  getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = res.locals.validatedQuery || {};

      const filters: QueryFilters = {
        search: search as string,
      };

      const result = await this.userService.findAll({
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        sortOrder: sortOrder as "asc" | "desc",
        filters,
      });

      const response: ApiResponse<PaginatedResponse<UserResponse>> = {
        success: true,
        message: "Users retrieved successfully",
        data: result,
      };

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  // GET /users/:id - Get user by ID
  getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = parseInt(id ?? '');

      const user = await this.userService.findById(userId);

      if (!user) {
        throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
      }

      const response: ApiResponse<UserResponse> = {
        success: true,
        message: "User retrieved successfully",
        data: user,
      };

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  // POST /users - Create new user
  createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;

      // Check if user already exists
      const existingUser = await this.userService.findByEmail(userData.email);
      if (existingUser) {
        throw new AppError(
          "User with this email already exists",
          HttpStatusCode.CONFLICT
        );
      }

      const user = await this.userService.create(userData);

      const response: ApiResponse<UserResponse> = {
        success: true,
        message: "User created successfully",
        data: user,
      };

      res.status(HttpStatusCode.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  // PUT /users/:id - Update user
  updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = parseInt(id ?? '');
      const updateData: UpdateUserDto = req.body;

      // Check if user exists
      const existingUser = await this.userService.findById(userId);
      if (!existingUser) {
        throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
      }

      // Check email uniqueness if email is being updated
      if (updateData.email && updateData.email !== existingUser.email) {
        const emailExists = await this.userService.findByEmail(
          updateData.email
        );
        if (emailExists) {
          throw new AppError("Email already in use", HttpStatusCode.CONFLICT);
        }
      }

      const updatedUser = await this.userService.update(userId, updateData);

      if (!updatedUser) {
        throw new AppError("Failed to update user", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }

      const response: ApiResponse<UserResponse> = {
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      };

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  // DELETE /users/:id - Delete user
  deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = parseInt(id ?? '');

      // Check if user exists
      const existingUser = await this.userService.findById(userId);
      if (!existingUser) {
        throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
      }

      await this.userService.delete(userId);

      const response: ApiResponse = {
        success: true,
        message: "User deleted successfully",
      };

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  // GET /users/:id/profile - Get user profile
  getUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = parseInt(id ?? '');

      const profile = await this.userService.getProfile(userId);

      if (!profile) {
        throw new AppError("User profile not found", HttpStatusCode.NOT_FOUND);
      }

      const response: ApiResponse<UserResponse> = {
        success: true,
        message: "User profile retrieved successfully",
        data: profile,
      };

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  // PATCH /users/:id/status - Update user status
  updateUserStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const userId = parseInt(id ?? '');

      const updatedUser = await this.userService.updateStatus(userId, isActive);

      if (!updatedUser) {
        throw new AppError("Failed to update user status", HttpStatusCode.INTERNAL_SERVER_ERROR);
      }

      const response: ApiResponse<UserResponse> = {
        success: true,
        message: `User ${isActive ? "activated" : "deactivated"} successfully`,
        data: updatedUser,
      };

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  // PATCH /users/:id/change-password - Change user password
  changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;
      const userId = parseInt(id ?? '');

      await this.userService.changePassword(userId, oldPassword, newPassword);

      const response: ApiResponse = {
        success: true,
        message: "Password changed successfully",
      };

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}

// Export instance for use in routes
export const userController = new UserController();
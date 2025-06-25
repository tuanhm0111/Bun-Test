import type { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import { createResponse } from "../utils/helpers";
import { logger } from "../utils/logger";

class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();

      res.json(createResponse(true, "Users retrieved successfully", users));
    } catch (error) {
      logger.error("Error getting users:", error);
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id || "");

      if (isNaN(id)) {
        return res
          .status(400)
          .json(
            createResponse(
              false,
              "Invalid user ID",
              undefined,
              "User ID must be a number"
            )
          );
      }

      const user = await userService.getUserById(id);

      if (!user) {
        return res.status(404).json(createResponse(false, "User not found"));
      }

      res.json(createResponse(true, "User retrieved successfully", user));
    } catch (error) {
      logger.error("Error getting user by ID:", error);
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.createUser(req.body);

      res
        .status(201)
        .json(createResponse(true, "User created successfully", user));
    } catch (error) {
      logger.error("Error creating user:", error);

      if (error instanceof Error && error.message.includes("already exists")) {
        return res.status(409).json(createResponse(false, error.message));
      }

      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id || "");

      if (isNaN(id)) {
        return res.status(400).json(createResponse(false, "Invalid user ID"));
      }

      const user = await userService.updateUser(id, req.body);

      if (!user) {
        return res.status(404).json(createResponse(false, "User not found"));
      }

      res.json(createResponse(true, "User updated successfully", user));
    } catch (error) {
      logger.error("Error updating user:", error);
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id || "");

      if (isNaN(id)) {
        return res.status(400).json(createResponse(false, "Invalid user ID"));
      }

      const deleted = await userService.deleteUser(id);

      if (!deleted) {
        return res.status(404).json(createResponse(false, "User not found"));
      }

      res.json(createResponse(true, "User deleted successfully"));
    } catch (error) {
      logger.error("Error deleting user:", error);
      next(error);
    }
  }
}

export const userController = new UserController();

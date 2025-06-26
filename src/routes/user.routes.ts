import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validation.middleware";
import {
  createUserSchema,
  updateUserSchema,
  userParamsSchema,
  getUsersQuerySchema,
  updateUserStatusSchema,
  changePasswordSchema,
} from "../utils/validator";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const userController = new UserController();

// GET /users?page=1&limit=10&search=john&sortBy=name&sortOrder=asc
router.get(
  "/",
  validateQuery(getUsersQuerySchema),
  asyncHandler(userController.getUsers)
);

// GET /users/:id
router.get(
  "/:id",
  validateParams(userParamsSchema),
  asyncHandler(userController.getUserById)
);

// GET /users/:id/profile
router.get(
  "/:id/profile",
  validateParams(userParamsSchema),
  asyncHandler(userController.getUserProfile)
);

// POST /users
router.post(
  "/",
  validateBody(createUserSchema),
  asyncHandler(userController.createUser)
);

// PUT /users/:id
router.put(
  "/:id",
  validateParams(userParamsSchema),
  validateBody(updateUserSchema),
  asyncHandler(userController.updateUser)
);

// PATCH /users/:id/status
router.patch(
  "/:id/status",
  validateParams(userParamsSchema),
  validateBody(updateUserStatusSchema),
  asyncHandler(userController.updateUserStatus)
);

// PATCH /users/:id/change-password
router.patch(
  "/:id/change-password",
  validateParams(userParamsSchema),
  validateBody(changePasswordSchema),
  asyncHandler(userController.changePassword)
);

// DELETE /users/:id
router.delete(
  "/:id",
  validateParams(userParamsSchema),
  asyncHandler(userController.deleteUser)
);

export default router;

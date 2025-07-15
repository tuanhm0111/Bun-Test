import { Router } from "express";
import { userController } from "../controllers/user.controller";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validation.middleware";
import { userSchemas } from '../utils/validators/user.validator';

const router = Router();

// GET /users?page=1&limit=10&search=john&sortBy=username&sortOrder=asc
router.get(
  "/",
  validateQuery(userSchemas.query),
  userController.getUsers
);

// GET /users/:id
router.get(
  "/:id",
  validateParams(userSchemas.params),
  userController.getUserById
);

// GET /users/:id/profile
router.get(
  "/:id/profile",
  validateParams(userSchemas.params),
  userController.getUserProfile
);

// POST /users
router.post(
  "/",
  validateBody(userSchemas.create),
  userController.createUser
);

// PUT /users/:id
router.put(
  "/:id",
  validateParams(userSchemas.params),
  validateBody(userSchemas.update),
  userController.updateUser
);

// PATCH /users/:id/status
router.patch(
  "/:id/status",
  validateParams(userSchemas.params),
  validateBody(userSchemas.status),
  userController.updateUserStatus
);

// PATCH /users/:id/change-password
router.patch(
  "/:id/change-password",
  validateParams(userSchemas.params),
  validateBody(userSchemas.changePassword),
  userController.changePassword
);

// DELETE /users/:id
router.delete(
  "/:id",
  validateParams(userSchemas.params),
  userController.deleteUser
);

export default router;

import { HttpStatusCode } from "./constants";
import type { IAppError } from "../types/common.type";

// Error factory functions
export const createError = (
  message: string,
  statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR,
  isOperational: boolean = true
): IAppError => {
  const error = new Error(message) as Error & IAppError;
  error.statusCode = statusCode;
  error.isOperational = isOperational;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, createError);
  }

  return error;
};

// Specific error creators
export const createValidationError = (message: string): IAppError =>
  createError(message, HttpStatusCode.BAD_REQUEST);

export const createNotFoundError = (resource: string = "Resource"): IAppError =>
  createError(`${resource} not found`, HttpStatusCode.NOT_FOUND);

export const createConflictError = (message: string): IAppError =>
  createError(message, HttpStatusCode.CONFLICT);

export const createUnauthorizedError = (
  message: string = "Unauthorized"
): IAppError => createError(message, HttpStatusCode.UNAUTHORIZED);

export const createForbiddenError = (
  message: string = "Forbidden"
): IAppError => createError(message, HttpStatusCode.FORBIDDEN);

export const createInternalServerError = (
  message: string = "Internal server error"
): IAppError =>
  createError(message, HttpStatusCode.INTERNAL_SERVER_ERROR, false);

// Error type guards
export const isAppError = (error: any): error is IAppError => {
  return (
    error &&
    typeof error.statusCode === "number" &&
    typeof error.isOperational === "boolean"
  );
};

export const isOperationalError = (error: any): boolean => {
  return isAppError(error) && error.isOperational;
};

// Error handling utilities
export const handleDatabaseError = (error: any): IAppError => {
  if (error.code === "P2002") {
    return createConflictError("Resource already exists");
  }
  if (error.code === "P2025") {
    return createNotFoundError();
  }
  return createInternalServerError("Database operation failed");
};

export const handleValidationError = (errors: string[]): IAppError => {
  const message =
    errors.length > 1 ? `Validation failed: ${errors.join(", ")}` : errors[0] || "Validation failed";
  return createValidationError(message);
};

// Legacy class-based AppError for compatibility
export class AppError extends Error implements IAppError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  static badRequest(message: string): AppError {
    return new AppError(message, HttpStatusCode.BAD_REQUEST);
  }

  static unauthorized(message: string = "Unauthorized"): AppError {
    return new AppError(message, HttpStatusCode.UNAUTHORIZED);
  }

  static forbidden(message: string = "Forbidden"): AppError {
    return new AppError(message, HttpStatusCode.FORBIDDEN);
  }

  static notFound(resource: string = "Resource"): AppError {
    return new AppError(`${resource} not found`, HttpStatusCode.NOT_FOUND);
  }

  static conflict(message: string): AppError {
    return new AppError(message, HttpStatusCode.CONFLICT);
  }

  static internal(message: string = "Internal server error"): AppError {
    return new AppError(message, HttpStatusCode.INTERNAL_SERVER_ERROR, false);
  }
}

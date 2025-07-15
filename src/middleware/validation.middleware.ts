import type { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { createResponse } from "../utils/helpers";
import { HttpStatusCode } from "../utils/constants";

/**
 * Middleware to validate request body using Zod schema.
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const response = createResponse(
        false,
        "Validation failed",
        undefined,
        result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      );

      res.status(HttpStatusCode.BAD_REQUEST).json(response);
      return;
    }
    req.body = result.data;
    next();
  };
};

/**
 * Middleware to validate request parameters using Zod schema.
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const response = createResponse(
        false,
        "Validation failed",
        undefined,
        result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      );
      
      res.status(HttpStatusCode.BAD_REQUEST).json(response);
      return;
    }
    req.params = result.data;
    next();
  };
};

/**
 * Middleware to validate request query parameters using Zod schema.
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const response = createResponse(
        false,
        "Validation failed",
        undefined,
        result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      );
      
      res.status(HttpStatusCode.BAD_REQUEST).json(response);
      return;
    }
    res.locals.validatedQuery = result.data;
    next();
  };
};

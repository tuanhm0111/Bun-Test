import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Middleware to validate request body, params, or query using Zod schemas.
 * If validation fails, it responds with a 400 status and error details.
 * If validation succeeds, it modifies the request object with validated data.
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: "Validation failed",
        details: result.error.errors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
};

/**
 * Middleware to validate request parameters using Zod schema.
 * If validation fails, it responds with a 400 status and error details.
 * @param schema Zod schema to validate request parameters
 * @returns
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({
        error: "Validation failed",
        details: result.error.errors,
      });
      return;
    }
    req.params = result.data;
    next();
  };
};

/*
 * Middleware to validate request query parameters using Zod schema.
 * If validation fails, it responds with a 400 status and error details.
 * @param schema Zod schema to validate request query parameters
 * @returns
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({
        error: "Validation failed",
        details: result.error.errors,
      });
      return;
    }
    res.locals.validatedQuery = result.data;
    next();
  };
};

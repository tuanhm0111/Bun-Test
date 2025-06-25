import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { createResponse } from '../utils/helpers';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json(createResponse(
          false,
          'Validation failed',
          undefined,
          error.message
        ));
      }
      next(error);
    }
  };
};
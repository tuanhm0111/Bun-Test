import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { createResponse } from '../utils/helpers';
import { HttpStatusCode } from '../utils/constants';
import { env } from '../config/env';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Unhandled error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
  });

  const isDevelopment = env.NODE_ENV === 'development';
  const response = createResponse(
    false,
    'Internal server error',
    undefined,
    isDevelopment ? [error.message] : ['Something went wrong']
  );

  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
};

export const notFoundHandler = (req: Request, res: Response) => {
  const response = createResponse(
    false,
    'Route not found',
    undefined,
    [`Cannot ${req.method} ${req.path}`]
  );

  res.status(HttpStatusCode.NOT_FOUND).json(response);
};
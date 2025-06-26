import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { createResponse } from '../utils/helpers';
import { env } from '../config';

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

  res.status(500).json(createResponse(
    false,
    'Internal server error',
    undefined,
    isDevelopment ? error.message : 'Something went wrong'
  ));
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json(createResponse(
    false,
    'Route not found',
    undefined,
    `Cannot ${req.method} ${req.path}`
  ));
};
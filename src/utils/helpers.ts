import type { ApiResponse } from '../types/common.type';

export const createResponse = <T>(
  success: boolean,
  message: string,
  data?: T,
  errors?: string[]
): ApiResponse<T> => ({
  success,
  message,
  data,
  errors,
});
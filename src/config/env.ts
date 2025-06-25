import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3009'),
  API_VERSION: z.string().default('v1'),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRE: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('*'),
});

export const env = envSchema.parse(process.env)
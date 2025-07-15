import { env } from './config/env';
import app from './app';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`API Base URL: http://localhost:${env.PORT}/api/${env.API_VERSION}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
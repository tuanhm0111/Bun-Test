import app from './app';
import { env } from './config';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`API Base URL: http://localhost:${env.PORT}/api/${env.API_VERSION}`);
      logger.info(`Available endpoints:`);
      logger.info(`   GET    /api/${env.API_VERSION}/health`);
      logger.info(`   GET    /api/${env.API_VERSION}/users`);
      logger.info(`   GET    /api/${env.API_VERSION}/users/:id`);
      logger.info(`   POST   /api/${env.API_VERSION}/users`);
      logger.info(`   PUT    /api/${env.API_VERSION}/users/:id`);
      logger.info(`   DELETE /api/${env.API_VERSION}/users/:id`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
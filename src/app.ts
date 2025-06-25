import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config";
import routes from "./routes";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(loggerMiddleware);

// API routes
app.use(`/api/${env.API_VERSION}`, routes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Professional API Server",
    version: env.API_VERSION,
    environment: env.NODE_ENV,
    timestamp: new Date(),
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

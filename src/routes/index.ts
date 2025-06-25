import { Router } from "express";
import userRoutes from "./user.routes";

const router = Router();

router.use("/users", userRoutes);

// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

export default router;

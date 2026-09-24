import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { getManagerDashboardStats } from "./manager.controller.js";

const router = Router();

router.get(
  "/dashboard",
  authMiddleware,
  authorize("MANAGER"),
  getManagerDashboardStats,
);

export default router;

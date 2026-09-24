import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import {
  getAdminDashboardStats,
  getAdminActivity,
} from "./admin.controller.js";

const router = Router();

router.get(
  "/dashboard",
  authMiddleware,
  authorize("ADMIN"),
  getAdminDashboardStats,
);

router.get("/activity", authMiddleware, authorize("ADMIN"), getAdminActivity);

export default router;

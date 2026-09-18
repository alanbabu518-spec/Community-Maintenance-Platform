import { Router } from "express";
import {
  getMyNotifications,
  markMyNotificationAsRead,
} from "./notification.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getMyNotifications);
router.patch("/:id/read", authMiddleware, markMyNotificationAsRead);

export default router;
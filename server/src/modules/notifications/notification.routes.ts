import { Router } from "express";
import {
  getMyNotifications,
  markMyNotificationAsRead,
} from "./notification.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { subscribeToPush } from "./push.controller.js";

const router = Router();

router.get("/", authMiddleware, getMyNotifications);
router.patch("/:id/read", authMiddleware, markMyNotificationAsRead);
router.post("/push/subscribe", authMiddleware, subscribeToPush);

export default router;

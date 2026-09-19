import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import {
  createAnnouncement,
  getCommunityAnnouncements,
} from "./announcement.controller.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN", "MANAGER"),
  createAnnouncement,
);

router.get(
  "/",
  authMiddleware,
  getCommunityAnnouncements,
);

export default router;
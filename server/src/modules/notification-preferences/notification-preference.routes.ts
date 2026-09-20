import { Router } from "express";
import {
  getPreferences,
  updatePreferences,
} from "./notification-preference.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js"

const router = Router();

router.get("/", authMiddleware, getPreferences);

router.patch("/", authMiddleware, updatePreferences);

export default router;
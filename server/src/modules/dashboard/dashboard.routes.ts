import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { getStats } from "../dashboard/dashboard.controller.js";

const router = Router();

router.get("/stats", authMiddleware, getStats);

export default router;
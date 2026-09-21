import { Router } from "express";
import { googleController } from "./google.controller.js";

const router = Router();

/**
 * Google OAuth
 */

// Start Google login
router.get(
  "/google",
  googleController.loginStart,
);

// Start Google registration
router.get(
  "/google/register",
  googleController.registerStart,
);

// Google OAuth callback
router.get(
  "/google/callback",
  googleController.callback,
);

export default router;
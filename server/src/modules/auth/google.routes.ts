import { Router } from "express";
import { googleController } from "./google.controller.js";

const router = Router();

router.get("/google", googleController.loginStart);

router.get("/google/register", googleController.registerStart);

router.get("/google/callback", googleController.callback);

router.post("/google/register/complete", googleController.completeRegistration);

export default router;

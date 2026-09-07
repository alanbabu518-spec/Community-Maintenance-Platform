import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { maintenanceController } from "./maintenance.controller.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorize("RESIDENT"),
  maintenanceController.createRequest
);

router.get(
  "/",
  authMiddleware,
  maintenanceController.getRequests
);

export default router;
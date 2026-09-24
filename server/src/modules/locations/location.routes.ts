import { Router } from "express";
import { locationController } from "./location.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = Router();

router.get("/communities", locationController.getCommunities);

router.post(
  "/communities",
  authMiddleware,
  authorize("ADMIN"),
  locationController.createCommunity,
);

router.post(
  "/communities/:communityId/buildings",
  authMiddleware,
  authorize("ADMIN"),
  locationController.createBuilding,
);

router.post(
  "/buildings/:buildingId/units",
  authMiddleware,
  authorize("ADMIN"),
  locationController.createUnit,
);

router.get(
  "/my-community",
  authMiddleware,
  authorize("MANAGER"),
  locationController.getMyCommunity,
);

router.get(
  "/communities/:communityId/buildings",
  locationController.getBuildings,
);

router.get(
  "/buildings/:buildingId",
  authMiddleware,
  authorize("ADMIN"),
  locationController.getBuildingById,
);

router.get("/buildings/:buildingId/units", locationController.getUnits);
export default router;

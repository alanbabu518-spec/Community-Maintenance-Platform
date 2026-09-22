import { Router } from "express";
import { locationController } from "./location.controller.js";

const router = Router();

router.get("/communities", locationController.getCommunities);

router.get(
  "/communities/:communityId/buildings",
  locationController.getBuildings,
);

router.get(
  "/buildings/:buildingId/units",
  locationController.getUnits,
);

export default router;
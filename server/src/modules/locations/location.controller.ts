import type { Request, Response, NextFunction } from "express";
import { locationService } from "./location.service.js";

export const locationController = {
  async getCommunities(
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const communities = await locationService.getCommunities();

      return res.status(200).json({
        communities,
      });
    } catch (error) {
      next(error);
    }
  },

  async getBuildings(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const communityId = Number(req.params.communityId);

      if (!Number.isInteger(communityId) || communityId <= 0) {
        return res.status(400).json({
          message: "Valid community ID is required",
        });
      }

      const buildings =
        await locationService.getBuildingsByCommunityId(communityId);

      return res.status(200).json({
        buildings,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUnits(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const buildingId = Number(req.params.buildingId);

      if (!Number.isInteger(buildingId) || buildingId <= 0) {
        return res.status(400).json({
          message: "Valid building ID is required",
        });
      }

      const units =
        await locationService.getUnitsByBuildingId(buildingId);

      return res.status(200).json({
        units,
      });
    } catch (error) {
      next(error);
    }
  },
};
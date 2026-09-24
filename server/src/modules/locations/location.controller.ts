import type { Request, Response, NextFunction } from "express";
import { locationService } from "./location.service.js";
import {
  createBuildingSchema,
  createCommunitySchema,
  createUnitSchema,
} from "./location.schema.js";

export const locationController = {
  async getCommunities(_req: Request, res: Response, next: NextFunction) {
    try {
      const communities = await locationService.getCommunities();

      return res.status(200).json({
        communities,
      });
    } catch (error) {
      next(error);
    }
  },

  async getBuildings(req: Request, res: Response, next: NextFunction) {
    try {
      const communityId = Number(req.params.communityId);

      if (!Number.isInteger(communityId) || communityId <= 0) {
        return res.status(400).json({
          message: "Valid community ID is required",
        });
      }

      const buildings = await locationService.getBuildingsByCommunityId(
        communityId,
        req.user?.userId,
        req.user?.role,
      );

      return res.status(200).json({
        buildings,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUnits(req: Request, res: Response, next: NextFunction) {
    try {
      const buildingId = Number(req.params.buildingId);

      if (!Number.isInteger(buildingId) || buildingId <= 0) {
        return res.status(400).json({
          message: "Valid building ID is required",
        });
      }

      const units = await locationService.getUnitsByBuildingId(
        buildingId,
        req.user?.userId,
        req.user?.role,
      );

      return res.status(200).json({
        units,
      });
    } catch (error) {
      next(error);
    }
  },
  async createCommunity(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createCommunitySchema.parse(req.body);

      const community = await locationService.createCommunity(data);

      return res.status(201).json({
        message: "Community created successfully",
        community,
      });
    } catch (error) {
      next(error);
    }
  },
  async createBuilding(req: Request, res: Response, next: NextFunction) {
    try {
      const communityId = Number(req.params.communityId);

      if (!Number.isInteger(communityId) || communityId <= 0) {
        return res.status(400).json({
          message: "Valid community ID is required",
        });
      }

      const data = createBuildingSchema.parse(req.body);

      const building = await locationService.createBuilding({
        name: data.name,
        communityId,
      });

      return res.status(201).json({
        message: "Building created successfully",
        building,
      });
    } catch (error) {
      next(error);
    }
  },
  async createUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const buildingId = Number(req.params.buildingId);

      if (!Number.isInteger(buildingId) || buildingId <= 0) {
        return res.status(400).json({
          message: "Valid building ID is required",
        });
      }

      const data = createUnitSchema.parse(req.body);

      const unit = await locationService.createUnit({
        unitNumber: data.unitNumber,
        buildingId,
      });

      return res.status(201).json({
        message: "Unit created successfully",
        unit,
      });
    } catch (error) {
      next(error);
    }
  },
  async getBuildingById(req: Request, res: Response, next: NextFunction) {
    try {
      const buildingId = Number(req.params.buildingId);

      if (!Number.isInteger(buildingId) || buildingId <= 0) {
        return res.status(400).json({
          message: "Valid building ID is required",
        });
      }

      const building = await locationService.getBuildingById(buildingId);

      return res.status(200).json({
        building,
      });
    } catch (error) {
      next(error);
    }
  },
  async getMyCommunity(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const community = await locationService.getMyCommunity(
        req.user.userId,
        req.user.role,
      );

      return res.status(200).json({
        community,
      });
    } catch (error) {
      next(error);
    }
  },
};

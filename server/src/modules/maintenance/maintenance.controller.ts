import type { Request, Response } from "express";
import { createMaintenanceRequestSchema } from "./maintenance.schema.js";
import { maintenanceService } from "./maintenance.service.js";

export const maintenanceController = {
  async createRequest(req: Request, res: Response) {
    try {
      const data = createMaintenanceRequestSchema.parse(req.body);

      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const request = await maintenanceService.createRequest(
        data,
        req.user.userId,
      );

      return res.status(201).json({
        message: "Maintenance request created successfully",
        request,
      });
    } catch (error) {
      console.error(error);

      return res.status(400).json({
        message: "Invalid maintenance request data",
      });
    }
  },

  async getRequests(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const requests = await maintenanceService.getRequests(
      req.user.userId,
      req.user.role
    );

    return res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch maintenance requests",
    });
  }
},
};

import type { Request, Response } from "express";
import { maintenanceService } from "./maintenance.service.js";
import { createMaintenanceRequestSchema, updateMaintenanceRequestSchema, assignTechnicianSchema } from "./maintenance.schema.js";

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
        req.user.role,
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

  async getRequestById(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({
          message: "Invalid request ID",
        });
      }

      const request = await maintenanceService.getRequestById(
        id,
        req.user.userId,
        req.user.role,
      );

      if (!request) {
        return res.status(404).json({
          message: "Maintenance request not found",
        });
      }

      return res.status(200).json({
        request,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to fetch maintenance request",
      });
    }
  },

  async updateRequest(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({
          message: "Invalid request ID",
        });
      }

      const data = updateMaintenanceRequestSchema.parse(req.body);

      const request = await maintenanceService.updateRequest(id, data);

      return res.status(200).json({
        message: "Maintenance request updated successfully",
        request,
      });
    } catch (error) {
      console.error(error);

      return res.status(400).json({
        message: "Invalid maintenance request update",
      });
    }
  },
  async assignTechnician(req: Request, res: Response) {
  try {
    const requestId = Number(req.params.id);

    if (Number.isNaN(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID",
      });
    }

    const data = assignTechnicianSchema.parse(req.body);

    const request = await maintenanceService.assignTechnician(
      requestId,
      data.technicianId
    );

    return res.status(200).json({
      message: "Technician assigned successfully",
      request,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: "Failed to assign technician",
    });
  }
},
};

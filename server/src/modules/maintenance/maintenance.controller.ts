import type { Request, Response, NextFunction } from "express";
import { maintenanceService } from "./maintenance.service.js";
import {
  createMaintenanceRequestSchema,
  updateMaintenanceRequestSchema,
  assignTechnicianSchema,
  maintenanceQuerySchema,
} from "./maintenance.schema.js";

export const maintenanceController = {
  async createRequest(req: Request, res: Response, next: NextFunction) {
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
      next(error);
    }
  },

  async getRequests(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const query = maintenanceQuerySchema.parse(req.query);

      const { page, limit, status, priority, category } = query;

      const filters = {
        status,
        priority,
        category,
      };

      const result = await maintenanceService.getRequests(
        req.user.userId,
        req.user.role,
        page,
        limit,
        filters,
      );

      const totalPages = Math.ceil(result.total / limit);

      return res.status(200).json({
        requests: result.requests,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getRequestById(req: Request, res: Response, next: NextFunction) {
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

      return res.status(200).json({
        request,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateRequest(req: Request, res: Response, next: NextFunction) {
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
      next(error);
    }
  },

  async assignTechnician(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
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
        data.technicianId,
      );

      return res.status(200).json({
        message: "Technician assigned successfully",
        request,
      });
    } catch (error) {
      next(error);
    }
  },
};
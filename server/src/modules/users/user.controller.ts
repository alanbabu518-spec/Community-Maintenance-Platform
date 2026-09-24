import type { Request, Response, NextFunction } from "express";
import { userService } from "./user.service.js";
import { createStaffSchema, userQuerySchema } from "./user.schema.js";
import { z } from "zod";

export const userController = {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = userQuerySchema.parse(req.query);

      const result = await userService.getUsers(filters);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async createStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createStaffSchema.parse(req.body);

      const user = await userService.createStaff(data);

      return res.status(201).json({
        message: "Staff user created successfully",
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateActiveStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = z.coerce.number().int().positive().parse(req.params.id);

      const isActive = z.coerce.boolean().parse(req.body.isActive);

      const user = await userService.updateActiveStatus(userId, isActive);

      return res.status(200).json({
        message: isActive
          ? "User activated successfully"
          : "User deactivated successfully",
        user,
      });
    } catch (error) {
      next(error);
    }
  },
  async getTechnicians(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const technicians = await userService.getTechnicians(req.user.userId);

      return res.status(200).json({
        users: technicians,
      });
    } catch (error) {
      next(error);
    }
  },
  async getResidents(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const residents = await userService.getResidents(req.user.userId);

      return res.status(200).json({
        users: residents,
      });
    } catch (error) {
      next(error);
    }
  },
};

import type { Request, Response, NextFunction } from "express";
import { userService } from "./user.service.js";
import { createStaffSchema, userQuerySchema } from "./user.schema.js";

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
};

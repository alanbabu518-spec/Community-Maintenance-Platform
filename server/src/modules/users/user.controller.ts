import type { Request, Response, NextFunction } from "express";
import { userService } from "./user.service.js";

export const userController = {
  async getUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const users = await userService.getUsers();

      return res.status(200).json({
        users,
      });
    } catch (error) {
      next(error);
    }
  },

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = await userService.createUser(req.body);

      return res.status(201).json({
        user,
      });
    } catch (error) {
      next(error);
    }
  },
};
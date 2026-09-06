import type { Request, Response } from "express";
import { userService } from "./user.service.js";

export const userController = {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await userService.getUsers();

      res.status(200).json(users);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch users",
      });
    }
  },

  async createUser(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);

      res.status(201).json(user);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to create user",
      });
    }
  },
};
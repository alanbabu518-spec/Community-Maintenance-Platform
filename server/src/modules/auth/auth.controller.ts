import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { registerSchema } from "./auth.schema.js";

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const data = registerSchema.parse(req.body);

      const user = await authService.register(data);

      res.status(201).json({
        message: "User registered successfully",
        user,
      });
    } catch (error) {
      console.error(error);

      res.status(400).json({
        message: "Invalid registration data",
      });
    }
  },
};

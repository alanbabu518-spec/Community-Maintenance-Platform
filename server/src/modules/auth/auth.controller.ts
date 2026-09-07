import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import { Prisma } from "@prisma/client";

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

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res.status(409).json({
          message: "Email already registered",
        });
      }

      return res.status(400).json({
        message: "Invalid registration data",
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const data = loginSchema.parse(req.body);

      const user = await authService.login(data);

      res.status(200).json({
        message: "Login successful",
        user: {
          id: user.user.id,
          name: user.user.name,
          email: user.user.email,
          role: user.user.role,
        },
        token: user.token,
      });
    } catch (error) {
      console.error(error);

      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  },
};

import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import { registerSchema, loginSchema, verifyOtpSchema } from "./auth.schema.js";
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

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const data = verifyOtpSchema.parse(req.body);

    const user = await authService.verifyOtp(
      data.email,
      data.otp
    );

    return res.status(200).json({
      message: "Email verified successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
},

  async login(req: Request, res: Response) {
    try {
      const data = loginSchema.parse(req.body);

      const result = await authService.login(data);

      res.cookie("access_token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: "Login successful",
        user: result.user,
      });
    } catch (error) {
      console.error(error);

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
  },
};

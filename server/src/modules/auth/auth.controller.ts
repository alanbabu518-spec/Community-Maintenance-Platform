import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schema.js";
import { AppError } from "../../utils/AppError.js";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);

      const user = await authService.register(data);

      return res.status(201).json({
        message: "User registered successfully",
        user,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }

      console.error("Registration error:", error);

      return next(error);
    }
  },
  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const data = resendOtpSchema.parse(req.body);

      const result = await authService.resendOtp(data.email);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const data = verifyOtpSchema.parse(req.body);

      const user = await authService.verifyOtp(data.email, data.otp);

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
        maxAge: Number(process.env.COOKIE_MAX_AGE),
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

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = forgotPasswordSchema.parse(req.body);

      const result = await authService.forgotPassword(data.email);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = resetPasswordSchema.parse(req.body);

      const result = await authService.resetPassword(data.token, data.password);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Not authenticated",
        });
      }

      const user = await authService.getCurrentUser(req.user.userId);

      return res.status(200).json({
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response) {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  },
};

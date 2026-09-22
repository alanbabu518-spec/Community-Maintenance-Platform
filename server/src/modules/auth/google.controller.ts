import type { Request, Response, NextFunction } from "express";
import { googleService } from "./google.service.js";

export const googleController = {
  async loginStart(req: Request, res: Response, next: NextFunction) {
    try {
      const googleUrl = await googleService.createAuthorizationUrl("login");

      return res.redirect(googleUrl);
    } catch (error) {
      next(error);
    }
  },

  async registerStart(req: Request, res: Response, next: NextFunction) {
    try {
      const googleUrl = await googleService.createAuthorizationUrl("register");

      return res.redirect(googleUrl);
    } catch (error) {
      next(error);
    }
  },

  async callback(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, state } = req.query;

      if (typeof code !== "string" || typeof state !== "string") {
        return res.status(400).json({
          message: "Invalid Google OAuth callback",
        });
      }

      const result = await googleService.handleOAuthCallback(code, state);

      if (result.type === "login") {
        res.cookie("access_token", result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: Number(process.env.COOKIE_MAX_AGE),
        });

        return res.redirect(`${process.env.CLIENT_URL}/`);
      }

      return res.redirect(
        `${process.env.CLIENT_URL}/google-setup?token=${encodeURIComponent(
          result.registrationToken,
        )}`,
      );
    } catch (error) {
      if (!(error instanceof Error)) {
        return next(error);
      }

      if (
        error.message ===
        "No CommunityCare account found. Please create an account first."
      ) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=no-account`);
      }

      if (
        error.message ===
          "An account with this email already exists. Please login." ||
        error.message ===
          "An account with this Google account already exists. Please login."
      ) {
        return res.redirect(
          `${process.env.CLIENT_URL}/register?error=account-exists`,
        );
      }

      return next(error);
    }
  },
  async completeRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const { registrationToken, communityId, buildingId, unitId } = req.body;

      if (typeof registrationToken !== "string" || !registrationToken.trim()) {
        return res.status(400).json({
          message: "Registration token is required",
        });
      }

      const parsedCommunityId = Number(communityId);
      const parsedBuildingId = Number(buildingId);
      const parsedUnitId = Number(unitId);

      if (
        !Number.isInteger(parsedCommunityId) ||
        parsedCommunityId <= 0 ||
        !Number.isInteger(parsedBuildingId) ||
        parsedBuildingId <= 0 ||
        !Number.isInteger(parsedUnitId) ||
        parsedUnitId <= 0
      ) {
        return res.status(400).json({
          message: "Valid community, building, and unit are required",
        });
      }

      const result = await googleService.completeGoogleRegistration(
        registrationToken,
        parsedCommunityId,
        parsedBuildingId,
        parsedUnitId,
      );

      res.cookie("access_token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: Number(process.env.COOKIE_MAX_AGE),
      });

      return res.status(200).json({
        message: "Google registration completed successfully",
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  },
};

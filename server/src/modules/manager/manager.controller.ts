import type { Request, Response, NextFunction } from "express";
import { getManagerDashboard } from "./manager.service.js";

export const getManagerDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const data = await getManagerDashboard(req.user.userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

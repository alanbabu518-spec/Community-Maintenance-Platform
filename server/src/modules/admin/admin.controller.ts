import type { Request, Response, NextFunction } from "express";
import { getAdminDashboard } from "./admin.service.js";
import { getAdminRecentActivity } from "./admin.activity.service.js";

export const getAdminDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getAdminDashboard();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminActivity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

    const data = await getAdminRecentActivity(limit);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

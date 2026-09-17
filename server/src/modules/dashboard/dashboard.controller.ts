import type { Request, Response, NextFunction } from "express";
import { getDashboardStats } from "../dashboard/dashboard.service.js";

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const stats = await getDashboardStats(user.userId, user.role);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
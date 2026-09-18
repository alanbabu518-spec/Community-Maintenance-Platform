import type { Request, Response, NextFunction } from "express";
import {
  getNotifications,
  markAsRead,
} from "./notification.service.js";

export async function getMyNotifications(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getNotifications(userId, page, limit);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function markMyNotificationAsRead(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.userId;
    const notificationId = Number(req.params.id);

    const result = await markAsRead(notificationId, userId);

    if (result.count === 0) {
      res.status(404).json({
        message: "Notification not found",
      });
      return;
    }

    res.status(200).json({
      message: "Notification marked as read",
    });
  } catch (error) {
    next(error);
  }
}
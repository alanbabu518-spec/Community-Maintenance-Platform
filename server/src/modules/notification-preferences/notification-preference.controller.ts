import type{ Request, Response, NextFunction } from "express";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "./notification-preference.service.js";
import { updateNotificationPreferenceSchema } from "./notification-preference.schema.js";

export const getPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;

    const preferences = await getNotificationPreferences(userId);

    res.status(200).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;

    const data = updateNotificationPreferenceSchema.parse(req.body);

    const preferences = await updateNotificationPreferences(userId, data);

    res.status(200).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    next(error);
  }
};
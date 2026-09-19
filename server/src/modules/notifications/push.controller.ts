import type { Request, Response, NextFunction } from "express";
import { subscribeUserToPush } from "./push.service.js";

export async function subscribeToPush(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.userId;
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      res.status(400).json({
        message: "Invalid push subscription",
      });
      return;
    }

    await subscribeUserToPush({
      userId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    });

    res.status(201).json({
      message: "Push subscription saved successfully",
    });
  } catch (error) {
    next(error);
  }
}
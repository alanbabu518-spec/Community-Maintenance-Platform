import type { Request, Response, NextFunction } from "express";
import {
  createCommunityAnnouncement,
  getAnnouncements,
} from "./announcement.service.js";

export async function createAnnouncement(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { communityId, title, message } = req.body;

    if (
      !communityId ||
      !Number.isInteger(Number(communityId)) ||
      !title?.trim() ||
      !message?.trim()
    ) {
      res.status(400).json({
        message: "Valid community ID, title, and message are required",
      });
      return;
    }

    const announcement = await createCommunityAnnouncement({
      communityId: Number(communityId),
      title,
      message,
    });

    res.status(201).json(announcement);
  } catch (error) {
    next(error);
  }
}

export async function getCommunityAnnouncements(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const communityId = Number(req.query.communityId);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!communityId) {
      res.status(400).json({
        message: "Community ID is required",
      });
      return;
    }

    const result = await getAnnouncements(communityId, page, limit);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

import type { Request, Response, NextFunction } from "express";
import {
  createCommunityAnnouncement,
  getAnnouncements,
} from "./announcement.service.js";
import { userRepository } from "../users/user.repository.js";

export async function createAnnouncement(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const { title, message, category, priority } = req.body;

    if (
      !title?.trim() ||
      !message?.trim() ||
      !category?.trim() ||
      !priority?.trim()
    ) {
      res.status(400).json({
        message:
          "Title, message, category, and priority are required",
      });
      return;
    }

    const user = await userRepository.findById(req.user.userId);

    if (!user) {
      res.status(401).json({
        message: "User not found",
      });
      return;
    }

    const communityId =
      user.communityId ??
      user.unit?.building?.communityId ??
      null;

    if (!communityId) {
      res.status(400).json({
        message: "Your account is not associated with a community",
      });
      return;
    }

    const announcement = await createCommunityAnnouncement({
      communityId,
      title,
      message,
      category,
      priority,
      author: `${req.user.role}`,
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
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const user = await userRepository.findById(req.user.userId);

    if (!user) {
      res.status(401).json({
        message: "User not found",
      });
      return;
    }

    const userCommunityId =
      user.communityId ??
      user.unit?.building?.communityId ??
      null;

    if (!userCommunityId) {
      res.status(400).json({
        message: "Your account is not associated with a community",
      });
      return;
    }

    const requestedCommunityId = req.query.communityId
      ? Number(req.query.communityId)
      : userCommunityId;

    if (
      !Number.isInteger(requestedCommunityId) ||
      requestedCommunityId <= 0
    ) {
      res.status(400).json({
        message: "Invalid community ID",
      });
      return;
    }

    if (requestedCommunityId !== userCommunityId) {
      res.status(403).json({
        message: "You cannot access announcements from another community",
      });
      return;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getAnnouncements(
      userCommunityId,
      page,
      limit,
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
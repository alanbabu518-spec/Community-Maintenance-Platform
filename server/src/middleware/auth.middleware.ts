import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userRepository } from "../modules/users/user.repository.js";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as Express.AuthenticatedUser;

    const user = await userRepository.findById(decoded.userId);

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
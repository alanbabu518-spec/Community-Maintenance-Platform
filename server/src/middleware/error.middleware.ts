import type { NextFunction, Request, Response } from "express";

import { ZodError } from "zod";
import multer from "multer";

import { AppError } from "../utils/AppError.js";

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues,
    });
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Too many files uploaded.",
      });
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size must not exceed 5 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "File upload failed.",
    });
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Too many files uploaded.",
      });
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size must not exceed 5 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "File upload failed.",
    });
  }

  if (
    error instanceof Error &&
    error.message === "Only image files are allowed"
  ) {
    return res.status(400).json({
      success: false,
      message: "Only image files are allowed.",
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

import type { NextFunction, Request, Response } from "express";
import { fileTypeFromBuffer } from "file-type";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function validateImages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const files = req.files;

    if (!files || !Array.isArray(files)) {
      return next();
    }

    for (const file of files) {
      const detectedType = await fileTypeFromBuffer(file.buffer);

      if (!detectedType || !ALLOWED_IMAGE_TYPES.has(detectedType.mime)) {
        return res.status(400).json({
          success: false,
          message: "Invalid image file.",
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}
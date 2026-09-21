import { describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { validateImages } from "../middleware/validateImages.js";

describe("validateImages", () => {
  it("should allow a valid JPEG image", async () => {
    const next = vi.fn();

    const jpegBuffer = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    ]);

    const req = {
      files: [
        {
          buffer: jpegBuffer,
          mimetype: "image/jpeg",
        },
      ],
    } as unknown as Request;

    const res = {} as Response;

    await validateImages(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
  it("should reject a file with an invalid image signature", async () => {
    const next = vi.fn();
    const status = vi.fn().mockReturnThis();
    const json = vi.fn();

    const fakeImageBuffer = Buffer.from("this is not an image");

    const req = {
      files: [
        {
          buffer: fakeImageBuffer,
          mimetype: "image/jpeg",
        },
      ],
    } as unknown as Request;

    const res = {
      status,
      json,
    } as unknown as Response;

    await validateImages(req, res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid image file.",
    });

    expect(next).not.toHaveBeenCalled();
  });
});

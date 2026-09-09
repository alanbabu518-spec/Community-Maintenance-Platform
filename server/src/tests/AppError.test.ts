import { describe, expect, it } from "vitest";
import { AppError } from "../utils/AppError.js";

describe("AppError", () => {
  it("should create an error with message and status code", () => {
    const error = new AppError("User not found", 404);

    expect(error.message).toBe("User not found");
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe("AppError");
  });
});
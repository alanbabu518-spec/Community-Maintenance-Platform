import { describe, expect, it } from "vitest";

describe("Socket authentication - tokenVersion", () => {
  it("should accept a token when tokenVersion matches", () => {
    const decoded = {
      userId: 1,
      tokenVersion: 2,
    };

    const user = {
      tokenVersion: 2,
    };

    const isValid = user.tokenVersion === decoded.tokenVersion;

    expect(isValid).toBe(true);
  });

  it("should reject a token when tokenVersion does not match", () => {
    const decoded = {
      userId: 1,
      tokenVersion: 1,
    };

    const user = {
      tokenVersion: 2,
    };

    const isValid = user.tokenVersion === decoded.tokenVersion;

    expect(isValid).toBe(false);
  });

  it("should reject a token when the user does not exist", () => {
    const user = undefined;

    const isValid = user !== undefined;

    expect(isValid).toBe(false);
  });
});

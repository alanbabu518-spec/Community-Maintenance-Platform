import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { userRepository } from "../modules/users/user.repository.js";

vi.mock("../modules/users/user.repository.js", () => ({
  userRepository: {
    findById: vi.fn(),
  },
}));

function createAuthToken(
  userId: number,
  role: string,
  tokenVersion = 0,
) {
  return jwt.sign(
    {
      userId,
      role,
      tokenVersion,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" },
  );
}

function authCookie(token: string) {
  return [`access_token=${token}`];
}

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(userRepository.findById).mockResolvedValue({
    tokenVersion: 0,
    isActive: true,
  } as any);
});

describe("Security API", () => {
  describe("Authentication", () => {
    it("should return 401 without authentication", async () => {
      const response = await request(app).get("/api/maintenance");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Authentication required");
    });

    it("should return 401 for an invalid JWT", async () => {
      const response = await request(app)
        .get("/api/maintenance")
        .set("Cookie", ["access_token=invalid-token"]);

      expect(response.status).toBe(401);
      expect(userRepository.findById).not.toHaveBeenCalled();
    });

    it("should return 401 for an expired JWT", async () => {
      const token = jwt.sign(
        {
          userId: 32,
          role: "RESIDENT",
          tokenVersion: 0,
        },
        process.env.JWT_SECRET!,
        { expiresIn: -1 },
      );

      const response = await request(app)
        .get("/api/maintenance")
        .set("Cookie", authCookie(token));

      expect(response.status).toBe(401);
    });

    it("should return 401 for an inactive user", async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        tokenVersion: 0,
        isActive: false,
      } as any);

      const token = createAuthToken(32, "RESIDENT");

      const response = await request(app)
        .get("/api/maintenance")
        .set("Cookie", authCookie(token));

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid or expired token");
    });

    it("should return 401 when token version does not match", async () => {
      vi.mocked(userRepository.findById).mockResolvedValue({
        tokenVersion: 1,
        isActive: true,
      } as any);

      const token = createAuthToken(32, "RESIDENT", 0);

      const response = await request(app)
        .get("/api/maintenance")
        .set("Cookie", authCookie(token));

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid or expired token");
    });
  });

  describe("Role authorization", () => {
    it("should reject a resident from an admin-only endpoint", async () => {
      const token = createAuthToken(32, "RESIDENT");

      const response = await request(app)
        .get("/api/users")
        .set("Cookie", authCookie(token));

      expect(response.status).toBe(403);
    });

    it("should reject a technician from an admin-only endpoint", async () => {
      const token = createAuthToken(32, "TECHNICIAN");

      const response = await request(app)
        .get("/api/users")
        .set("Cookie", authCookie(token));

      expect(response.status).toBe(403);
    });

    it("should reject a manager from an admin-only endpoint", async () => {
      const token = createAuthToken(32, "MANAGER");

      const response = await request(app)
        .get("/api/users")
        .set("Cookie", authCookie(token));

      expect(response.status).toBe(403);
    });

    it("should allow an admin to access an admin-only endpoint", async () => {
      const token = createAuthToken(32, "ADMIN");

      const response = await request(app)
        .get("/api/users")
        .set("Cookie", authCookie(token));

      expect(response.status).not.toBe(403);
    });
  });
});
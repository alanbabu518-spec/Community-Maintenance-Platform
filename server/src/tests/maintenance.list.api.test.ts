import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { maintenanceService } from "../modules/maintenance/maintenance.service.js";
import { userRepository } from "../modules/users/user.repository.js";

vi.mock("../modules/maintenance/maintenance.service.js", () => ({
  maintenanceService: {
    getRequests: vi.fn(),
  },
}));

vi.mock("../modules/users/user.repository.js", () => ({
  userRepository: {
    findById: vi.fn(),
  },
}));

function createAuthToken(userId: number, role: string) {
  return jwt.sign(
    {
      userId,
      role,
      tokenVersion: 0,
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
  } as any);

  vi.mocked(maintenanceService.getRequests).mockReset();
});

describe("GET /api/maintenance", () => {
  it("should return maintenance requests", async () => {
    vi.mocked(maintenanceService.getRequests).mockResolvedValue({
      requests: [],
      total: 0,
    });

    const token = createAuthToken(32, "RESIDENT");

    const response = await request(app)
      .get("/api/maintenance")
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(200);
    expect(response.body.requests).toEqual([]);
    expect(response.body.pagination).toBeDefined();
  });

  it("should return 401 without authentication", async () => {
    const response = await request(app).get("/api/maintenance");

    expect(response.status).toBe(401);
  });

  it("should return 401 when the JWT is invalid", async () => {
    const response = await request(app)
      .get("/api/maintenance")
      .set("Cookie", ["access_token=invalid-token"]);

    expect(response.status).toBe(401);

    expect(
      maintenanceService.getRequests,
    ).not.toHaveBeenCalled();
  });

  it("should pass pagination and filters to the service", async () => {
    vi.mocked(maintenanceService.getRequests).mockResolvedValue({
      requests: [],
      total: 0,
    });

    const token = createAuthToken(32, "RESIDENT");

    const response = await request(app)
      .get(
        "/api/maintenance?page=2&limit=10&status=OPEN&priority=HIGH",
      )
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(200);

    expect(maintenanceService.getRequests).toHaveBeenCalled();
  });

  it("should return 400 when query parameters are invalid", async () => {
    const token = createAuthToken(32, "RESIDENT");

    const response = await request(app)
      .get("/api/maintenance?page=invalid")
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(400);

    expect(
      maintenanceService.getRequests,
    ).not.toHaveBeenCalled();
  });
});
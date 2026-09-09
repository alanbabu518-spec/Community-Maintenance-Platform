import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { maintenanceService } from "../modules/maintenance/maintenance.service.js";

vi.mock("../modules/maintenance/maintenance.service.js", () => ({
  maintenanceService: {
    getRequests: vi.fn(),
  },
}));

describe("GET /api/maintenance", () => {
  it("should return maintenance requests for an authenticated resident", async () => {
    vi.mocked(maintenanceService.getRequests).mockResolvedValue({
      requests: [],
      total: 0,
    });

    const token = jwt.sign(
      { userId: 32, role: "RESIDENT" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    const response = await request(app)
      .get("/api/maintenance")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      requests: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    });

    expect(maintenanceService.getRequests).toHaveBeenCalledWith(
      32,
      "RESIDENT",
      1,
      10,
      {
        status: undefined,
        priority: undefined,
        category: undefined,
      },
    );
  });

  it("should return 401 when no authentication token is provided", async () => {
    const response = await request(app).get("/api/maintenance");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: "Authentication required",
    });

    expect(maintenanceService.getRequests).not.toHaveBeenCalled();
  });

  it("should return 401 when an invalid JWT is provided", async () => {
    const response = await request(app)
      .get("/api/maintenance")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: "Invalid or expired token",
    });

    expect(maintenanceService.getRequests).not.toHaveBeenCalled();
  });

  it("should apply pagination and filters from query parameters", async () => {
    vi.mocked(maintenanceService.getRequests).mockResolvedValue({
      requests: [],
      total: 12,
    });

    const token = jwt.sign(
      { userId: 32, role: "RESIDENT" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    const response = await request(app)
      .get(
        "/api/maintenance?page=2&limit=5&status=OPEN&priority=HIGH&category=PLUMBING",
      )
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.pagination).toEqual({
      page: 2,
      limit: 5,
      total: 12,
      totalPages: 3,
    });

    expect(maintenanceService.getRequests).toHaveBeenCalledWith(
      32,
      "RESIDENT",
      2,
      5,
      {
        status: "OPEN",
        priority: "HIGH",
        category: "PLUMBING",
      },
    );
  });

  it("should return 400 when an invalid query parameter is provided", async () => {
    const token = jwt.sign(
      { userId: 32, role: "RESIDENT" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    const response = await request(app)
      .get("/api/maintenance?page=0&limit=500")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);

    expect(maintenanceService.getRequests).not.toHaveBeenCalled();
  });
});
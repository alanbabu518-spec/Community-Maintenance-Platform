import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { maintenanceService } from "../modules/maintenance/maintenance.service.js";
import { AppError } from "../utils/AppError.js";

vi.mock("../modules/maintenance/maintenance.service.js", () => ({
  maintenanceService: {
    getRequests: vi.fn(),
    getRequestById: vi.fn(),
  },
}));

describe("GET /api/maintenance", () => {
  it("should return 401 when no authentication token is provided", async () => {
    const response = await request(app).get("/api/maintenance");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: "Authentication required",
    });
  });

  it("should return 401 when an invalid JWT is provided", async () => {
    const response = await request(app)
      .get("/api/maintenance")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: "Invalid or expired token",
    });
  });

  it("should allow an authenticated resident to access maintenance requests", async () => {
    vi.mocked(maintenanceService.getRequests).mockResolvedValue({
      requests: [],
      total: 0,
    });

    const token = jwt.sign(
      {
        userId: 32,
        role: "RESIDENT",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );

    const response = await request(app)
      .get("/api/maintenance")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});

describe("GET /api/users", () => {
  it("should return 403 when a resident tries to access the users endpoint", async () => {
    const token = jwt.sign(
      {
        userId: 32,
        role: "RESIDENT",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );

    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);

    expect(response.body).toEqual({
      message: "Access Denied",
    });
  });

  it("should allow an admin to access the users endpoint", async () => {
    const token = jwt.sign(
      {
        userId: 1,
        role: "ADMIN",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );

    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("users");
  });
});

describe("GET /api/maintenance/:id", () => {
  it("should allow a resident to access their own maintenance request", async () => {
    vi.mocked(maintenanceService.getRequestById).mockResolvedValue({
      id: 17,
      title: "Water leakage",
      description: "Water is leaking from the bathroom",
      category: "PLUMBING",
      priority: "HIGH",
      status: "OPEN",
      residentId: 32,
      unitId: 1,
      technicianId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const token = jwt.sign(
      {
        userId: 32,
        role: "RESIDENT",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );

    const response = await request(app)
      .get("/api/maintenance/17")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("request");

    expect(maintenanceService.getRequestById).toHaveBeenCalledWith(
      17,
      32,
      "RESIDENT",
    );
  });

  it("should return 403 when a resident tries to access another resident's request", async () => {
    vi.mocked(maintenanceService.getRequestById).mockRejectedValue(
      new AppError("Access denied", 403),
    );

    const token = jwt.sign(
      {
        userId: 32,
        role: "RESIDENT",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );

    const response = await request(app)
      .get("/api/maintenance/17")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);

    expect(response.body).toEqual({
      message: "Access denied",
    });

    expect(maintenanceService.getRequestById).toHaveBeenCalledWith(
      17,
      32,
      "RESIDENT",
    );
  });

  it("should allow a technician to access an assigned maintenance request", async () => {
    vi.mocked(maintenanceService.getRequestById).mockResolvedValue({
      id: 17,
      title: "Water leakage",
      description: "Water is leaking from the bathroom",
      category: "PLUMBING",
      priority: "HIGH",
      status: "ASSIGNED",
      residentId: 32,
      unitId: 1,
      technicianId: 29,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const token = jwt.sign(
      {
        userId: 29,
        role: "TECHNICIAN",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );

    const response = await request(app)
      .get("/api/maintenance/17")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("request");

    expect(maintenanceService.getRequestById).toHaveBeenCalledWith(
      17,
      29,
      "TECHNICIAN",
    );
  });

  it("should return 403 when a technician tries to access an unassigned request", async () => {
    vi.mocked(maintenanceService.getRequestById).mockRejectedValue(
      new AppError("Access denied", 403),
    );

    const token = jwt.sign(
      {
        userId: 29,
        role: "TECHNICIAN",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );

    const response = await request(app)
      .get("/api/maintenance/18")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);

    expect(response.body).toEqual({
      message: "Access denied",
    });

    expect(maintenanceService.getRequestById).toHaveBeenCalledWith(
      18,
      29,
      "TECHNICIAN",
    );
  });

  it("should allow a manager to access any maintenance request", async () => {
    vi.mocked(maintenanceService.getRequestById).mockResolvedValue({
      id: 18,
      title: "Electrical issue",
      description: "Power issue in the building",
      category: "ELECTRICAL",
      priority: "HIGH",
      status: "OPEN",
      residentId: 99,
      unitId: 2,
      technicianId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const token = jwt.sign(
      {
        userId: 2,
        role: "MANAGER",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );

    const response = await request(app)
      .get("/api/maintenance/18")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("request");

    expect(maintenanceService.getRequestById).toHaveBeenCalledWith(
      18,
      2,
      "MANAGER",
    );
  });
});

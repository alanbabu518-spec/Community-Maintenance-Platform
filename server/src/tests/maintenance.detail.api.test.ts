import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { maintenanceService } from "../modules/maintenance/maintenance.service.js";
import { AppError } from "../utils/AppError.js";

vi.mock("../modules/maintenance/maintenance.service.js", () => ({
  maintenanceService: {
    getRequestById: vi.fn(),
  },
}));

function createAuthToken(userId: number, role: string) {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" },
  );
}

function authCookie(token: string) {
  return [`access_token=${token}`];
}

describe("GET /api/maintenance/:id", () => {
  it("should return a maintenance request for the resident who owns it", async () => {
    vi.mocked(maintenanceService.getRequestById).mockResolvedValue({
      id: 20,
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

    const token = createAuthToken(32, "RESIDENT");

    const response = await request(app)
      .get("/api/maintenance/20")
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("request");

    expect(maintenanceService.getRequestById).toHaveBeenCalledWith(
      20,
      32,
      "RESIDENT",
    );
  });

  it("should return 403 when a resident accesses another resident's request", async () => {
    vi.mocked(maintenanceService.getRequestById).mockRejectedValue(
      new AppError(
        "You are not authorized to access this maintenance request",
        403,
      ),
    );

    const token = createAuthToken(32, "RESIDENT");

    const response = await request(app)
      .get("/api/maintenance/20")
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(403);

    expect(response.body).toEqual({
      success: false,
      message: "You are not authorized to access this maintenance request",
    });
  });

  it("should allow a technician to access an assigned request", async () => {
    vi.mocked(maintenanceService.getRequestById).mockResolvedValue({
      id: 20,
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

    const token = createAuthToken(29, "TECHNICIAN");

    const response = await request(app)
      .get("/api/maintenance/20")
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(200);

    expect(maintenanceService.getRequestById).toHaveBeenCalledWith(
      20,
      29,
      "TECHNICIAN",
    );
  });

  it("should return 403 when a technician accesses an unassigned request", async () => {
    vi.mocked(maintenanceService.getRequestById).mockRejectedValue(
      new AppError(
        "You are not authorized to access this maintenance request",
        403,
      ),
    );

    const token = createAuthToken(29, "TECHNICIAN");

    const response = await request(app)
      .get("/api/maintenance/20")
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(403);

    expect(response.body).toEqual({
      success: false,
      message: "You are not authorized to access this maintenance request",
    });
  });

  it("should allow a manager to access any maintenance request", async () => {
    vi.mocked(maintenanceService.getRequestById).mockResolvedValue({
      id: 20,
      title: "Electrical issue",
      description: "Power issue",
      category: "ELECTRICAL",
      priority: "HIGH",
      status: "OPEN",
      residentId: 99,
      unitId: 2,
      technicianId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const token = createAuthToken(2, "MANAGER");

    const response = await request(app)
      .get("/api/maintenance/20")
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(200);

    expect(maintenanceService.getRequestById).toHaveBeenCalledWith(
      20,
      2,
      "MANAGER",
    );
  });

  it("should return 404 when the maintenance request does not exist", async () => {
    vi.mocked(maintenanceService.getRequestById).mockRejectedValue(
      new AppError("Maintenance request not found", 404),
    );

    const token = createAuthToken(2, "MANAGER");

    const response = await request(app)
      .get("/api/maintenance/999")
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      message: "Maintenance request not found",
    });
  });

  it("should return 400 when the request ID is invalid", async () => {
    const token = createAuthToken(32, "RESIDENT");

    const response = await request(app)
      .get("/api/maintenance/abc")
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "Invalid request ID",
    });

    expect(maintenanceService.getRequestById).not.toHaveBeenCalled();
  });

  it("should return 401 when no authentication token is provided", async () => {
    const response = await request(app).get("/api/maintenance/20");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: "Authentication required",
    });

    expect(maintenanceService.getRequestById).not.toHaveBeenCalled();
  });
});
import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { maintenanceService } from "../modules/maintenance/maintenance.service.js";
import { AppError } from "../utils/AppError.js";

vi.mock("../modules/maintenance/maintenance.service.js", () => ({
  maintenanceService: {
    updateRequest: vi.fn(),
  },
}));

function createAuthToken(userId: number, role: string) {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
}

function authCookie(token: string) {
  return [`access_token=${token}`];
}

describe("PATCH /api/maintenance/:id", () => {
  it("should update a maintenance request successfully", async () => {
    vi.mocked(maintenanceService.updateRequest).mockResolvedValue({
      id: 20,
      title: "Updated water leakage",
      description: "Leakage is getting worse",
      category: "PLUMBING",
      priority: "URGENT",
      status: "OPEN",
      residentId: 32,
      unitId: 1,
      technicianId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const token = createAuthToken(1, "ADMIN");

    const response = await request(app)
      .patch("/api/maintenance/20")
      .set("Cookie", authCookie(token))
      .send({
        title: "Updated water leakage",
        priority: "URGENT",
      });

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty(
      "message",
      "Maintenance request updated successfully",
    );

    expect(response.body).toHaveProperty("request");

    expect(maintenanceService.updateRequest).toHaveBeenCalledWith(
      20,
      {
        priority: "URGENT",
      },
      1,
      "ADMIN",
    );
  });

  it("should allow a valid status transition", async () => {
    vi.mocked(maintenanceService.updateRequest).mockResolvedValue({
      id: 20,
      title: "Water leakage",
      description: "Water is leaking",
      category: "PLUMBING",
      priority: "HIGH",
      status: "ACKNOWLEDGED",
      residentId: 32,
      unitId: 1,
      technicianId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const token = createAuthToken(1, "MANAGER");

    const response = await request(app)
      .patch("/api/maintenance/20")
      .set("Cookie", authCookie(token))
      .send({
        status: "ACKNOWLEDGED",
      });

    expect(response.status).toBe(200);

    expect(maintenanceService.updateRequest).toHaveBeenCalledWith(
      20,
      {
        status: "ACKNOWLEDGED",
      },
      1,
      "MANAGER",
    );
  });

  it("should return 400 when an invalid status transition occurs", async () => {
    vi.mocked(maintenanceService.updateRequest).mockRejectedValue(
      new AppError("Invalid status transition: OPEN → RESOLVED", 400),
    );

    const token = createAuthToken(1, "MANAGER");

    const response = await request(app)
      .patch("/api/maintenance/20")
      .set("Cookie", authCookie(token))
      .send({
        status: "RESOLVED",
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "Invalid status transition: OPEN → RESOLVED",
    });
  });

  it("should return 404 when the maintenance request does not exist", async () => {
    vi.mocked(maintenanceService.updateRequest).mockRejectedValue(
      new AppError("Maintenance request not found", 404),
    );

    const token = createAuthToken(1, "ADMIN");

    const response = await request(app)
      .patch("/api/maintenance/999")
      .set("Cookie", authCookie(token))
      .send({
        priority: "HIGH",
      });

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      message: "Maintenance request not found",
    });
  });

  it("should return 400 when the request ID is invalid", async () => {
    const token = createAuthToken(1, "ADMIN");

    const response = await request(app)
      .patch("/api/maintenance/abc")
      .set("Cookie", authCookie(token))
      .send({
        priority: "HIGH",
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "Invalid request ID",
    });

    expect(maintenanceService.updateRequest).not.toHaveBeenCalled();
  });

  it("should return 403 when a resident tries to update a request", async () => {
    const token = createAuthToken(32, "RESIDENT");

    const response = await request(app)
      .patch("/api/maintenance/20")
      .set("Cookie", authCookie(token))
      .send({
        priority: "HIGH",
      });

    expect(response.status).toBe(403);

    expect(response.body).toEqual({
      message: "Access Denied",
    });

    expect(maintenanceService.updateRequest).not.toHaveBeenCalled();
  });

  it("should allow a manager to update a request", async () => {
    vi.mocked(maintenanceService.updateRequest).mockResolvedValue({
      id: 20,
      title: "Water leakage",
      description: "Water is leaking",
      category: "PLUMBING",
      priority: "HIGH",
      status: "OPEN",
      residentId: 32,
      unitId: 1,
      technicianId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const token = createAuthToken(2, "MANAGER");

    const response = await request(app)
      .patch("/api/maintenance/20")
      .set("Cookie", authCookie(token))
      .send({
        priority: "HIGH",
      });

    expect(response.status).toBe(200);
  });

  it("should return 401 when no authentication token is provided", async () => {
    const response = await request(app).patch("/api/maintenance/20").send({
      priority: "HIGH",
    });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: "Authentication required",
    });

    expect(maintenanceService.updateRequest).not.toHaveBeenCalled();
  });
});

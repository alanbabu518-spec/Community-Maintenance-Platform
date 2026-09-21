import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { maintenanceService } from "../modules/maintenance/maintenance.service.js";
import { userRepository } from "../modules/users/user.repository.js";
import { AppError } from "../utils/AppError.js";

vi.mock("../modules/maintenance/maintenance.service.js", () => ({
  maintenanceService: {
    assignTechnician: vi.fn(),
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
    {
      expiresIn: "1h",
    },
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

  vi.mocked(maintenanceService.assignTechnician).mockReset();
});

describe("PATCH /api/maintenance/:id/assign", () => {
  it("should assign a technician successfully", async () => {
    vi.mocked(maintenanceService.assignTechnician).mockResolvedValue({
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

    const token = createAuthToken(1, "ADMIN");

    const response = await request(app)
      .patch("/api/maintenance/20/assign")
      .set("Cookie", authCookie(token))
      .send({
        technicianId: 29,
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Technician assigned successfully",
      }),
    );

    expect(response.body.request).toHaveProperty("technicianId", 29);
    expect(response.body.request).toHaveProperty("status", "ASSIGNED");

    expect(
      maintenanceService.assignTechnician,
    ).toHaveBeenCalledWith(20, 29);
  });

  it("should allow a manager to assign a technician", async () => {
    vi.mocked(maintenanceService.assignTechnician).mockResolvedValue({
      id: 20,
      status: "ASSIGNED",
      technicianId: 29,
    } as any);

    const token = createAuthToken(2, "MANAGER");

    const response = await request(app)
      .patch("/api/maintenance/20/assign")
      .set("Cookie", authCookie(token))
      .send({
        technicianId: 29,
      });

    expect(response.status).toBe(200);

    expect(
      maintenanceService.assignTechnician,
    ).toHaveBeenCalledWith(20, 29);
  });

  it("should return 403 when a resident tries to assign a technician", async () => {
    const token = createAuthToken(32, "RESIDENT");

    const response = await request(app)
      .patch("/api/maintenance/20/assign")
      .set("Cookie", authCookie(token))
      .send({
        technicianId: 29,
      });

    expect(response.status).toBe(403);

    expect(response.body).toEqual({
      message: "Access Denied",
    });

    expect(
      maintenanceService.assignTechnician,
    ).not.toHaveBeenCalled();
  });

  it("should return 401 when no authentication token is provided", async () => {
    const response = await request(app)
      .patch("/api/maintenance/20/assign")
      .send({
        technicianId: 29,
      });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: "Authentication required",
    });

    expect(
      maintenanceService.assignTechnician,
    ).not.toHaveBeenCalled();
  });

  it("should return 400 when the request ID is invalid", async () => {
    const token = createAuthToken(1, "ADMIN");

    const response = await request(app)
      .patch("/api/maintenance/abc/assign")
      .set("Cookie", authCookie(token))
      .send({
        technicianId: 29,
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "Invalid request ID",
    });

    expect(
      maintenanceService.assignTechnician,
    ).not.toHaveBeenCalled();
  });

  it("should return 404 when the technician does not exist", async () => {
    vi.mocked(maintenanceService.assignTechnician).mockRejectedValue(
      new AppError("Technician not found", 404),
    );

    const token = createAuthToken(1, "ADMIN");

    const response = await request(app)
      .patch("/api/maintenance/20/assign")
      .set("Cookie", authCookie(token))
      .send({
        technicianId: 999,
      });

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      message: "Technician not found",
    });
  });

  it("should return 400 when the selected user is not a technician", async () => {
    vi.mocked(maintenanceService.assignTechnician).mockRejectedValue(
      new AppError("User is not a technician", 400),
    );

    const token = createAuthToken(1, "ADMIN");

    const response = await request(app)
      .patch("/api/maintenance/20/assign")
      .set("Cookie", authCookie(token))
      .send({
        technicianId: 2,
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "User is not a technician",
    });
  });

  it("should return 404 when the maintenance request does not exist", async () => {
    vi.mocked(maintenanceService.assignTechnician).mockRejectedValue(
      new AppError("Maintenance request not found", 404),
    );

    const token = createAuthToken(1, "ADMIN");

    const response = await request(app)
      .patch("/api/maintenance/999/assign")
      .set("Cookie", authCookie(token))
      .send({
        technicianId: 29,
      });

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      message: "Maintenance request not found",
    });
  });

  it("should return 400 when the request is not acknowledged", async () => {
    vi.mocked(maintenanceService.assignTechnician).mockRejectedValue(
      new AppError(
        "Technician can only be assigned to an acknowledged request",
        400,
      ),
    );

    const token = createAuthToken(1, "ADMIN");

    const response = await request(app)
      .patch("/api/maintenance/20/assign")
      .set("Cookie", authCookie(token))
      .send({
        technicianId: 29,
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message:
        "Technician can only be assigned to an acknowledged request",
    });
  });

  it("should return 400 when technicianId validation fails", async () => {
    const token = createAuthToken(1, "ADMIN");

    const response = await request(app)
      .patch("/api/maintenance/20/assign")
      .set("Cookie", authCookie(token))
      .send({
        technicianId: "invalid",
      });

    expect(response.status).toBe(400);

    expect(
      maintenanceService.assignTechnician,
    ).not.toHaveBeenCalled();
  });
});
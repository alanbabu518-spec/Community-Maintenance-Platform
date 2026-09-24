import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { maintenanceService } from "../modules/maintenance/maintenance.service.js";
import { userRepository } from "../modules/users/user.repository.js";
import { AppError } from "../utils/AppError.js";

vi.mock("../modules/maintenance/maintenance.service.js", () => ({
  maintenanceService: {
    updateRequest: vi.fn(),
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

  vi.mocked(maintenanceService.updateRequest).mockReset();

  vi.mocked(userRepository.findById).mockReset();
  vi.mocked(userRepository.findById).mockResolvedValue({
    tokenVersion: 0,
    isActive: true,
  } as any);
});

describe("PATCH /api/maintenance/:id", () => {
  it("should update a maintenance request successfully", async () => {
    vi.mocked(maintenanceService.updateRequest).mockResolvedValue({
      id: 1,
      title: "Updated request",
    } as any);

    const token = createAuthToken(32, "ADMIN");

    const response = await request(app)
      .patch("/api/maintenance/1")
      .set("Cookie", authCookie(token))
      .send({
        title: "Updated request",
      });

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("request");

    expect(maintenanceService.updateRequest).toHaveBeenCalledWith(
      1,
      {},
      32,
      "ADMIN",
    );
  });

  it("should allow a valid status transition", async () => {
    vi.mocked(maintenanceService.updateRequest).mockResolvedValue({
      id: 1,
      status: "ACKNOWLEDGED",
    } as any);

    const token = createAuthToken(32, "ADMIN");

    const response = await request(app)
      .patch("/api/maintenance/1")
      .set("Cookie", authCookie(token))
      .send({
        status: "ACKNOWLEDGED",
      });

    expect(response.status).toBe(200);

    expect(maintenanceService.updateRequest).toHaveBeenCalledWith(
      1,
      {
        status: "ACKNOWLEDGED",
      },
      32,
      "ADMIN",
    );
  });

  it("should return 400 when an invalid status transition occurs", async () => {
    vi.mocked(maintenanceService.updateRequest).mockRejectedValue(
      new AppError("Invalid status transition: OPEN → CLOSED", 400),
    );

    const token = createAuthToken(32, "ADMIN");

    const response = await request(app)
      .patch("/api/maintenance/1")
      .set("Cookie", authCookie(token))
      .send({
        status: "CLOSED",
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "Invalid status transition: OPEN → CLOSED",
    });
  });

  it("should return 404 when the maintenance request does not exist", async () => {
    vi.mocked(maintenanceService.updateRequest).mockResolvedValue(null);

    const token = createAuthToken(32, "ADMIN");

    const response = await request(app)
      .patch("/api/maintenance/999")
      .set("Cookie", authCookie(token))
      .send({
        status: "ACKNOWLEDGED",
      });

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      message: "Maintenance request not found",
    });

    expect(maintenanceService.updateRequest).toHaveBeenCalledWith(
      999,
      {
        status: "ACKNOWLEDGED",
      },
      32,
      "ADMIN",
    );
  });

  it("should return 400 when the request ID is invalid", async () => {
    const token = createAuthToken(32, "ADMIN");

    const response = await request(app)
      .patch("/api/maintenance/abc")
      .set("Cookie", authCookie(token))
      .send({
        status: "ACKNOWLEDGED",
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
      .patch("/api/maintenance/1")
      .set("Cookie", authCookie(token))
      .send({
        status: "ACKNOWLEDGED",
      });

    expect(response.status).toBe(403);

    expect(response.body).toEqual({
      message: "Access Denied",
    });

    expect(maintenanceService.updateRequest).not.toHaveBeenCalled();
  });

  it("should allow a manager to update a request", async () => {
    vi.mocked(maintenanceService.updateRequest).mockResolvedValue({
      id: 1,
      title: "Manager update",
    } as any);

    const token = createAuthToken(32, "MANAGER");

    const response = await request(app)
      .patch("/api/maintenance/1")
      .set("Cookie", authCookie(token))
      .send({
        status: "ACKNOWLEDGED",
      });

    expect(response.status).toBe(200);
  });

  it("should return 401 when no authentication token is provided", async () => {
    const response = await request(app).patch("/api/maintenance/1").send({
      status: "ACKNOWLEDGED",
    });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: "Authentication required",
    });

    expect(maintenanceService.updateRequest).not.toHaveBeenCalled();
  });
});

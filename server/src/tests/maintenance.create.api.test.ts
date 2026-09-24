import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { maintenanceService } from "../modules/maintenance/maintenance.service.js";
import { userRepository } from "../modules/users/user.repository.js";
import { AppError } from "../utils/AppError.js";

vi.mock("../modules/maintenance/maintenance.service.js", () => ({
  maintenanceService: {
    createRequest: vi.fn(),
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
    isActive: true,
    unitId: 1,
  } as any);

  vi.mocked(maintenanceService.createRequest).mockReset();
});

describe("POST /api/maintenance", () => {
  it("should create maintenance request for resident", async () => {
    vi.mocked(maintenanceService.createRequest).mockResolvedValue({
      id: 1,
    } as any);

    const token = createAuthToken(32, "RESIDENT");

    const response = await request(app)
      .post("/api/maintenance")
      .set("Cookie", authCookie(token))
      .send({
        title: "Water leakage",
        description: "Water is leaking",
        category: "PLUMBING",
        priority: "HIGH",
        unitId: 1,
      });

    expect(response.status).toBe(201);
    expect(maintenanceService.createRequest).toHaveBeenCalled();
  });

  it("should deny resident from creating a request for another unit", async () => {
    vi.mocked(maintenanceService.createRequest).mockRejectedValue(
      new AppError(
        "You are not authorized to file requests for this unit",
        403,
      ),
    );

    const token = createAuthToken(32, "RESIDENT");

    const response = await request(app)
      .post("/api/maintenance")
      .set("Cookie", authCookie(token))
      .send({
        title: "Water leakage",
        description: "Water is leaking",
        category: "PLUMBING",
        priority: "HIGH",
        unitId: 2,
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      message: "You are not authorized to file requests for this unit",
    });
  });

  it("should deny non-resident users", async () => {
    const token = createAuthToken(32, "ADMIN");

    const response = await request(app)
      .post("/api/maintenance")
      .set("Cookie", authCookie(token))
      .send({
        title: "Water leakage",
        description: "Water is leaking",
        category: "PLUMBING",
        priority: "HIGH",
        unitId: 1,
      });

    expect(response.status).toBe(403);
    expect(maintenanceService.createRequest).not.toHaveBeenCalled();
  });

  it("should return 401 when no authentication token is provided", async () => {
    const response = await request(app).post("/api/maintenance").send({
      title: "Water leakage",
      description: "Water is leaking",
      category: "PLUMBING",
      priority: "HIGH",
      unitId: 1,
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Authentication required",
    });

    expect(maintenanceService.createRequest).not.toHaveBeenCalled();
  });

  it("should return 400 when the maintenance service throws a validation error", async () => {
    vi.mocked(maintenanceService.createRequest).mockRejectedValue(
      new AppError("Invalid maintenance request", 400),
    );

    const token = createAuthToken(32, "RESIDENT");

    const response = await request(app)
      .post("/api/maintenance")
      .set("Cookie", authCookie(token))
      .send({
        title: "Water leakage",
        description: "Water is leaking",
        category: "PLUMBING",
        priority: "HIGH",
        unitId: 1,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Invalid maintenance request",
    });
  });
});

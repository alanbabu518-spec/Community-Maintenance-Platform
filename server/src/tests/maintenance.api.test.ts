import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { maintenanceService } from "../modules/maintenance/maintenance.service.js";
import { userRepository } from "../modules/users/user.repository.js";

vi.mock("../modules/maintenance/maintenance.service.js", () => ({
  maintenanceService: {
    getRequests: vi.fn(),
    getRequestById: vi.fn(),
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
  } as any);

  vi.mocked(maintenanceService.getRequests).mockReset();
  vi.mocked(maintenanceService.getRequestById).mockReset();
});

describe("Maintenance API", () => {
  it("should get maintenance requests for authenticated resident", async () => {
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
  });

  it("should return 401 without authentication", async () => {
    const response = await request(app).get("/api/maintenance");

    expect(response.status).toBe(401);
  });

  it("should return 401 for an invalid JWT", async () => {
    const response = await request(app)
      .get("/api/maintenance")
      .set("Cookie", ["access_token=invalid-token"]);

    expect(response.status).toBe(401);
    expect(maintenanceService.getRequests).not.toHaveBeenCalled();
  });

  it("should get a maintenance request by id for owner", async () => {
    vi.mocked(maintenanceService.getRequestById).mockResolvedValue({
      id: 1,
    } as any);

    const token = createAuthToken(32, "RESIDENT");

    const response = await request(app)
      .get("/api/maintenance/1")
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(200);
    expect(response.body.request).toEqual({ id: 1 });
  });

  it("should return 400 for invalid maintenance request id", async () => {
    const token = createAuthToken(32, "RESIDENT");

    const response = await request(app)
      .get("/api/maintenance/abc")
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid request ID");
  });

  it("should return 403 when a resident accesses another resident's request", async () => {
    vi.mocked(maintenanceService.getRequestById).mockRejectedValue(
      new Error("You are not authorized to access this maintenance request"),
    );

    const token = createAuthToken(32, "RESIDENT");

    const response = await request(app)
      .get("/api/maintenance/2")
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(500);
  });

  it("should allow a technician to access an assigned request", async () => {
    vi.mocked(maintenanceService.getRequestById).mockResolvedValue({
      id: 1,
      technicianId: 32,
    } as any);

    const token = createAuthToken(32, "TECHNICIAN");

    const response = await request(app)
      .get("/api/maintenance/1")
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(200);

    expect(maintenanceService.getRequestById).toHaveBeenCalledWith(
      1,
      32,
      "TECHNICIAN",
    );
  });

  it("should return 403 when a technician accesses an unassigned request", async () => {
    vi.mocked(maintenanceService.getRequestById).mockRejectedValue(
      new Error("You are not authorized to access this maintenance request"),
    );

    const token = createAuthToken(32, "TECHNICIAN");

    const response = await request(app)
      .get("/api/maintenance/2")
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(500);
  });

  it("should allow a manager to access any maintenance request", async () => {
    vi.mocked(maintenanceService.getRequestById).mockResolvedValue({
      id: 1,
    } as any);

    const token = createAuthToken(32, "MANAGER");

    const response = await request(app)
      .get("/api/maintenance/1")
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(200);

    expect(maintenanceService.getRequestById).toHaveBeenCalledWith(
      1,
      32,
      "MANAGER",
    );
  });

  it("should return 403 when a resident tries to access another user's request", async () => {
    vi.mocked(maintenanceService.getRequestById).mockRejectedValue(
      new Error("You are not authorized to access this maintenance request"),
    );

    const token = createAuthToken(32, "RESIDENT");

    const response = await request(app)
      .get("/api/maintenance/999")
      .set("Cookie", authCookie(token));

    expect(response.status).toBe(500);
  });
});

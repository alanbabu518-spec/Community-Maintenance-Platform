import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { maintenanceService } from "../modules/maintenance/maintenance.service.js";

vi.mock("../modules/maintenance/maintenance.service.js", () => ({
  maintenanceService: {
    createRequest: vi.fn(),
  },
}));

describe("POST /api/maintenance", () => {
  it("should create a maintenance request successfully", async () => {
    vi.mocked(maintenanceService.createRequest).mockResolvedValue({
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

    const token = jwt.sign(
      { userId: 32, role: "RESIDENT" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    const response = await request(app)
      .post("/api/maintenance")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Water leakage",
        description: "Water is leaking from the bathroom",
        category: "PLUMBING",
        priority: "HIGH",
        unitId: 1,
      });

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty(
      "message",
      "Maintenance request created successfully",
    );

    expect(response.body).toHaveProperty("request");

    expect(maintenanceService.createRequest).toHaveBeenCalledWith(
      {
        title: "Water leakage",
        description: "Water is leaking from the bathroom",
        category: "PLUMBING",
        priority: "HIGH",
        unitId: 1,
      },
      32,
    );
  });

  it("should return 401 when no authentication token is provided", async () => {
    const response = await request(app)
      .post("/api/maintenance")
      .send({
        title: "Water leakage",
        description: "Water is leaking from the bathroom",
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

  it("should return 403 when an admin tries to create a maintenance request", async () => {
    const token = jwt.sign(
      { userId: 1, role: "ADMIN" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    const response = await request(app)
      .post("/api/maintenance")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Water leakage",
        description: "Water is leaking from the bathroom",
        category: "PLUMBING",
        priority: "HIGH",
        unitId: 1,
      });

    expect(response.status).toBe(403);

    expect(response.body).toEqual({
      message: "Access Denied",
    });

    expect(maintenanceService.createRequest).not.toHaveBeenCalled();
  });

  it("should return 400 when request validation fails", async () => {
    const token = jwt.sign(
      { userId: 32, role: "RESIDENT" },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    const response = await request(app)
      .post("/api/maintenance")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "",
        description: "",
        category: "",
        priority: "INVALID",
        unitId: "wrong",
      });

    expect(response.status).toBe(400);

    expect(maintenanceService.createRequest).not.toHaveBeenCalled();
  });
});
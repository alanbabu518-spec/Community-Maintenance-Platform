import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../app.js";
import { authService } from "../modules/auth/auth.service.js";
import { AppError } from "../utils/AppError.js";

vi.mock("../modules/auth/auth.service.js", () => ({
  authService: {
    register: vi.fn(),
  },
}));

describe("POST /api/auth/register", () => {
  it("should register a user successfully", async () => {
    vi.mocked(authService.register).mockResolvedValue({
      id: 33,
      name: "Test Resident",
      email: "test@example.com",
      role: "RESIDENT",
      communityId: null,
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Test Resident",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);

    expect(response.body).toEqual({
      message: "User registered successfully",
      user: {
        id: 33,
        name: "Test Resident",
        email: "test@example.com",
        role: "RESIDENT",
        communityId: null,
      },
    });

    expect(response.body.user).not.toHaveProperty("passwordHash");
  });

  it("should return 400 when registration validation fails", async () => {
    vi.mocked(authService.register).mockClear();

    const response = await request(app).post("/api/auth/register").send({
      name: "A",
      email: "invalid-email",
      password: "123",
    });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "Invalid registration data",
    });

    expect(authService.register).not.toHaveBeenCalled();
  });

  it("should return 409 when email is already registered", async () => {
    vi.mocked(authService.register).mockRejectedValue(
      new AppError(
        "An account with this email already exists. Please login.",
        409,
      ),
    );

    const response = await request(app).post("/api/auth/register").send({
      name: "Existing User",
      email: "existing@example.com",
      password: "password123",
    });

    expect(response.status).toBe(409);

    expect(response.body).toEqual({
      success: false,
      message: "An account with this email already exists. Please login.",
    });
  });
});
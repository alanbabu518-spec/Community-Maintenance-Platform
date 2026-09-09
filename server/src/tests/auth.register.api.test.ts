import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../app.js";
import { authService } from "../modules/auth/auth.service.js";
import { Prisma } from "@prisma/client";

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
    });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Resident",
        email: "test@example.com",
        password: "password123",
        role: "RESIDENT",
      });

    expect(response.status).toBe(201);

    expect(response.body).toEqual({
      message: "User registered successfully",
      user: {
        id: 33,
        name: "Test Resident",
        email: "test@example.com",
        role: "RESIDENT",
      },
    });

    expect(response.body.user).not.toHaveProperty("passwordHash");

    expect(authService.register).toHaveBeenCalledWith({
      name: "Test Resident",
      email: "test@example.com",
      password: "password123",
      role: "RESIDENT",
    });
  });

  it("should return 400 when registration validation fails", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "A",
        email: "invalid-email",
        password: "123",
        role: "RESIDENT",
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "Invalid registration data",
    });

    expect(authService.register).not.toHaveBeenCalled();
  });

  it("should return 409 when email is already registered", async () => {
    const duplicateError =
      new Prisma.PrismaClientKnownRequestError(
        "Unique constraint failed on the fields: (`email`)",
        {
          code: "P2002",
          clientVersion: "7.10.0",
        },
      );

    vi.mocked(authService.register).mockRejectedValue(
      duplicateError,
    );

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Existing User",
        email: "existing@example.com",
        password: "password123",
        role: "RESIDENT",
      });

    expect(response.status).toBe(409);

    expect(response.body).toEqual({
      message: "Email already registered",
    });

    expect(authService.register).toHaveBeenCalledWith({
      name: "Existing User",
      email: "existing@example.com",
      password: "password123",
      role: "RESIDENT",
    });
  });
});
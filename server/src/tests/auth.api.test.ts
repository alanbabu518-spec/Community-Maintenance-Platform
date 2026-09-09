import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../app.js";
import { authService } from "../modules/auth/auth.service.js";

vi.mock("../modules/auth/auth.service.js", () => ({
  authService: {
    login: vi.fn(),
  },
}));

describe("POST /api/auth/login", () => {
  it("should login successfully with valid credentials", async () => {
    vi.mocked(authService.login).mockResolvedValue({
      user: {
        id: 32,
        name: "Jacob",
        email: "jacob20@example.com",
        role: "RESIDENT",
      },
      token: "test-jwt-token",
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "jacob20@example.com",
        password: "correct-password",
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "Login successful",
      user: {
        id: 32,
        name: "Jacob",
        email: "jacob20@example.com",
        role: "RESIDENT",
      },
      token: "test-jwt-token",
    });

    expect(authService.login).toHaveBeenCalledWith({
      email: "jacob20@example.com",
      password: "correct-password",
    });
  });

  it("should return 401 for invalid credentials", async () => {
    vi.mocked(authService.login).mockRejectedValue(
      new Error("Invalid Email or Password"),
    );

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "jacob20@example.com",
        password: "wrong-password",
      });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: "Invalid email or password",
    });

    expect(authService.login).toHaveBeenCalledWith({
      email: "jacob20@example.com",
      password: "wrong-password",
    });
  });

  it("should return 401 when login validation fails", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "not-an-email",
        password: "123",
      });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: "Invalid email or password",
    });

    expect(authService.login).not.toHaveBeenCalled();
  });
});
import { describe, expect, it, vi } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authService } from "../modules/auth/auth.service.js";
import { userRepository } from "../modules/users/user.repository.js";

vi.mock("../modules/users/user.repository.js", () => ({
  userRepository: {
    findByEmail: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
  },
}));

vi.mock("../utils/otp.js", () => ({
  generateOtp: vi.fn(() => "123456"),
  storeOtp: vi.fn(),
  getOtp: vi.fn(),
  deleteOtp: vi.fn(),
}));

vi.mock("../utils/passwordReset.js", () => ({
  generateResetToken: vi.fn(() => "test-reset-token"),
  storeResetToken: vi.fn(),
  getResetTokenUserId: vi.fn(),
  deleteResetToken: vi.fn(),
}));

vi.mock("../modules/auth/email.service.js", () => ({
  sendOtpEmail: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

describe("authService.login", () => {
  it("should login successfully with valid credentials", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      id: 32,
      name: "Jacob",
      email: "jacob20@example.com",
      passwordHash: "hashed-password",
      role: "RESIDENT",
      unitId: null,
      communityId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    vi.mocked(jwt.sign).mockReturnValue("test-jwt-token" as never);

    const result = await authService.login({
      email: "jacob20@example.com",
      password: "correct-password",
    });

    expect(result).toEqual({
      token: "test-jwt-token",
      user: {
        id: 32,
        name: "Jacob",
        email: "jacob20@example.com",
        role: "RESIDENT",
        communityId: null,
      },
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      "jacob20@example.com",
    );

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "correct-password",
      "hashed-password",
    );

    expect(jwt.sign).toHaveBeenCalled();
  });

  it("should reject login with an invalid password", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      id: 32,
      name: "Jacob",
      email: "jacob20@example.com",
      passwordHash: "hashed-password",
      role: "RESIDENT",
      unitId: null,
      communityId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    await expect(
      authService.login({
        email: "jacob20@example.com",
        password: "wrong-password",
      }),
    ).rejects.toThrow("Invalid Email or Password");

    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("should reject login when user does not exist", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

    await expect(
      authService.login({
        email: "unknown@example.com",
        password: "some-password",
      }),
    ).rejects.toThrow("Invalid Email or Password");

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("should propagate an error when password comparison fails", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      id: 32,
      name: "Jacob",
      email: "jacob20@example.com",
      passwordHash: "hashed-password",
      role: "RESIDENT",
      unitId: null,
      communityId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    vi.mocked(bcrypt.compare).mockRejectedValue(
      new Error("Password comparison failed"),
    );

    await expect(
      authService.login({
        email: "jacob20@example.com",
        password: "correct-password",
      }),
    ).rejects.toThrow("Password comparison failed");

    expect(jwt.sign).not.toHaveBeenCalled();
  });
});

describe("authService.register", () => {
  it("should hash the password and create a user", async () => {
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);

    vi.mocked(userRepository.create).mockResolvedValue({
      id: 33,
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      role: "RESIDENT",
      unitId: null,
      communityId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const input = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    const result = await authService.register(input);

    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);

    expect(userRepository.create).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      role: "RESIDENT",
    });

    expect(result).toEqual({
      id: 33,
      name: "Test User",
      email: "test@example.com",
      role: "RESIDENT",
      communityId: null,
    });

    expect(result).not.toHaveProperty("passwordHash");
  });
});
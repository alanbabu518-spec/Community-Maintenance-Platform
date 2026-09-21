import { describe, expect, it, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authService } from "../modules/auth/auth.service.js";
import { userRepository } from "../modules/users/user.repository.js";
import { generateOtp, storeOtp, getOtp, deleteOtp } from "../utils/otp.js";
import { sendOtpEmail } from "../modules/auth/email.service.js";

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
  },
}));

vi.mock("../modules/users/user.repository.js", () => ({
  userRepository: {
    findByEmail: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
    updatePassword: vi.fn(),
    incrementTokenVersion: vi.fn(),
    updateVerificationStatus: vi.fn(),
  },
}));

vi.mock("../utils/otp.js", () => ({
  generateOtp: vi.fn(),
  storeOtp: vi.fn(),
  getOtp: vi.fn(),
  deleteOtp: vi.fn(),
}));

vi.mock("../modules/auth/email.service.js", () => ({
  sendOtpEmail: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authService", () => {
  it("should register a new user", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

    vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);

    vi.mocked(userRepository.create).mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      role: "RESIDENT",
      emailVerified: false,
      tokenVersion: 0,
    } as any);

    vi.mocked(generateOtp).mockReturnValue("123456");
    vi.mocked(storeOtp).mockResolvedValue(undefined);
    vi.mocked(sendOtpEmail).mockResolvedValue(undefined);

    const result = await authService.register({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(result).toEqual({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      role: "RESIDENT",
      communityId: null,
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
  });

  it("should login successfully", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      role: "RESIDENT",
      emailVerified: true,
      tokenVersion: 0,
    } as any);

    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(jwt.sign).mockReturnValue("test-token" as any);

    const result = await authService.login({
      email: "test@example.com",
      password: "password123",
    });

    expect(result.token).toBe("test-token");

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: 1,
        role: "RESIDENT",
        tokenVersion: 0,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );
  });

  it("should reject login with invalid credentials", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      role: "RESIDENT",
      emailVerified: true,
      tokenVersion: 0,
    } as any);

    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    await expect(
      authService.login({
        email: "test@example.com",
        password: "wrong-password",
      }),
    ).rejects.toThrow();

    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("should reject registration when email already exists", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      id: 1,
      name: "Existing User",
      email: "test@example.com",
      role: "RESIDENT",
      emailVerified: true,
      tokenVersion: 0,
    } as any);

    await expect(
      authService.register({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      }),
    ).rejects.toThrow();

    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it("should verify an OTP successfully", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      role: "RESIDENT",
      emailVerified: false,
      tokenVersion: 0,
    } as any);

    vi.mocked(getOtp).mockResolvedValue("123456");

    vi.mocked(userRepository.updateVerificationStatus).mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      googleId: null,
      role: "RESIDENT",
      emailVerified: true,
      tokenVersion: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      unitId: null,
    } as any);

    vi.mocked(deleteOtp).mockResolvedValue(undefined);

    await authService.verifyOtp("test@example.com", "123456");

   expect(getOtp).toHaveBeenCalledWith(1);
expect(userRepository.updateVerificationStatus).toHaveBeenCalledWith(
  1,
  true,
);
expect(deleteOtp).toHaveBeenCalledWith(1);
  });
});

import { describe, expect, it, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { authService } from "../modules/auth/auth.service.js";
import { userRepository } from "../modules/users/user.repository.js";
import {
  generateOtp,
  storeOtp,
  getOtp,
  deleteOtp,
  getOtpAttempts,
  incrementOtpAttempts,
  isOtpResendAllowed,
  startOtpResendCooldown,
} from "../utils/otp.js";
import { sendOtpEmail } from "../modules/auth/email.service.js";

import {
  storePendingRegistration,
  getPendingRegistration,
  deletePendingRegistration,
} from "../utils/pendingRegistration.js";

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
  getOtpAttempts: vi.fn(),
  incrementOtpAttempts: vi.fn(),
  isOtpResendAllowed: vi.fn(),
  startOtpResendCooldown: vi.fn(),
  MAX_OTP_ATTEMPTS: 5,
}));

vi.mock("../utils/pendingRegistration.js", () => ({
  storePendingRegistration: vi.fn(),
  getPendingRegistration: vi.fn(),
  deletePendingRegistration: vi.fn(),
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

    vi.mocked(generateOtp).mockReturnValue("123456");

    vi.mocked(storePendingRegistration).mockResolvedValue(undefined);

    vi.mocked(storeOtp).mockResolvedValue(undefined);

    vi.mocked(sendOtpEmail).mockResolvedValue(undefined);

    const result = await authService.register({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      unitId: 1,
    });

    expect(result).toEqual({
      name: "Test User",
      email: "test@example.com",
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.com");

    expect(storePendingRegistration).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      unitId: 1,
    });

    expect(storeOtp).toHaveBeenCalledWith("test@example.com", "123456");

    expect(sendOtpEmail).toHaveBeenCalledWith(
      "test@example.com",
      "123456",
      "Test User",
    );

    expect(userRepository.create).not.toHaveBeenCalled();
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
        unitId: 1,
      }),
    ).rejects.toThrow();

    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it("should verify an OTP successfully", async () => {
    vi.mocked(getPendingRegistration).mockResolvedValue({
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      unitId: 1,
    });

    vi.mocked(getOtp).mockResolvedValue("123456");

    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

    vi.mocked(userRepository.create).mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      googleId: null,
      role: "RESIDENT",
      emailVerified: false,
      tokenVersion: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      unitId: 1,
      communityId: null,
    } as any);

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
      unitId: 1,
      communityId: null,
    } as any);

    vi.mocked(deleteOtp).mockResolvedValue(undefined);

    vi.mocked(deletePendingRegistration).mockResolvedValue(undefined);

    const result = await authService.verifyOtp("test@example.com", "123456");

    expect(result).toEqual({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      role: "RESIDENT",
      communityId: null,
    });

    expect(getPendingRegistration).toHaveBeenCalledWith("test@example.com");

    expect(getOtp).toHaveBeenCalledWith("test@example.com");

    expect(userRepository.create).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      role: "RESIDENT",
      unitId: 1,
    });

    expect(userRepository.updateVerificationStatus).toHaveBeenCalledWith(
      1,
      true,
    );

    expect(deleteOtp).toHaveBeenCalledWith("test@example.com");

    expect(deletePendingRegistration).toHaveBeenCalledWith("test@example.com");
  });

  it("should reject OTP after maximum attempts", async () => {
    vi.mocked(getPendingRegistration).mockResolvedValue({
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      unitId: 1,
    });

    vi.mocked(getOtp).mockResolvedValue("123456");

    vi.mocked(getOtpAttempts).mockResolvedValue(5);

    await expect(
      authService.verifyOtp("test@example.com", "wrong"),
    ).rejects.toThrow("Too many invalid OTP attempts");

    expect(incrementOtpAttempts).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it("should increment attempts when OTP is incorrect", async () => {
    vi.mocked(getPendingRegistration).mockResolvedValue({
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      unitId: 1,
    });

    vi.mocked(getOtp).mockResolvedValue("123456");

    vi.mocked(getOtpAttempts).mockResolvedValue(2);

    vi.mocked(incrementOtpAttempts).mockResolvedValue(3);

    await expect(
      authService.verifyOtp("test@example.com", "999999"),
    ).rejects.toThrow("Invalid OTP");

    expect(incrementOtpAttempts).toHaveBeenCalledWith("test@example.com");

    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it("should resend OTP successfully", async () => {
    vi.mocked(getPendingRegistration).mockResolvedValue({
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      unitId: 1,
    });

    vi.mocked(isOtpResendAllowed).mockResolvedValue(true);

    vi.mocked(generateOtp).mockReturnValue("654321");

    vi.mocked(storeOtp).mockResolvedValue(undefined);

    vi.mocked(sendOtpEmail).mockResolvedValue(undefined);

    vi.mocked(startOtpResendCooldown).mockResolvedValue(undefined);

    const result = await authService.resendOtp("test@example.com");

    expect(result).toEqual({
      message: "OTP sent successfully",
    });

    expect(storeOtp).toHaveBeenCalledWith("test@example.com", "654321");

    expect(sendOtpEmail).toHaveBeenCalledWith(
      "test@example.com",
      "654321",
      "Test User",
    );

    expect(startOtpResendCooldown).toHaveBeenCalledWith("test@example.com");
  });

  it("should reject OTP resend during cooldown", async () => {
    vi.mocked(getPendingRegistration).mockResolvedValue({
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
      unitId: 1,
    });

    vi.mocked(isOtpResendAllowed).mockResolvedValue(false);

    await expect(authService.resendOtp("test@example.com")).rejects.toThrow(
      "Please wait before requesting another OTP",
    );

    expect(generateOtp).not.toHaveBeenCalled();
    expect(storeOtp).not.toHaveBeenCalled();
    expect(sendOtpEmail).not.toHaveBeenCalled();
    expect(startOtpResendCooldown).not.toHaveBeenCalled();
  });
});

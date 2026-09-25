import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { LoginInput, RegisterInput } from "./auth.types.js";
import { userRepository } from "../users/user.repository.js";
import { toUserResponse } from "../users/user.mapper.js";
import {
  generateOtp,
  storeOtp,
  getOtp,
  deleteOtp,
  getOtpAttempts,
  incrementOtpAttempts,
  MAX_OTP_ATTEMPTS,
  isOtpResendAllowed,
  startOtpResendCooldown,
} from "../../utils/otp.js";
import {
  generateResetToken,
  storeResetToken,
  getResetTokenUserId,
  deleteResetToken,
} from "../../utils/passwordReset.js";
import {
  sendOtpEmail,
  sendPasswordResetEmail,
  sendOnboardingEmail,
} from "./email.service.js";
import {
  storePendingRegistration,
  getPendingRegistration,
  deletePendingRegistration,
} from "../../utils/pendingRegistration.js";
import { AppError } from "../../utils/AppError.js";

export const authService = {
  async register(data: RegisterInput) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError(
        "An account with this email already exists. Please login.",
        409,
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    await storePendingRegistration({
      name: data.name,
      email: data.email,
      passwordHash,
      unitId: data.unitId,
    });

    const otp = generateOtp();

    await storeOtp(data.email, otp);

    await sendOtpEmail(data.email, otp, data.name);

    return {
      name: data.name,
      email: data.email,
    };
  },

  async resendOtp(email: string) {
    const pendingRegistration = await getPendingRegistration(email);

    if (!pendingRegistration) {
      throw new AppError("Registration expired or not found", 400);
    }

    const allowed = await isOtpResendAllowed(email);

    if (!allowed) {
      throw new AppError("Please wait before requesting another OTP", 429);
    }

    const otp = generateOtp();

    await storeOtp(email, otp);

    await sendOtpEmail(email, otp, pendingRegistration.name);

    await startOtpResendCooldown(email);

    return {
      message: "OTP sent successfully",
    };
  },

  async verifyOtp(email: string, otp: string) {
    const pendingRegistration = await getPendingRegistration(email);

    if (!pendingRegistration) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    const storedOtp = await getOtp(email);

    if (!storedOtp) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    const attempts = await getOtpAttempts(email);

    if (attempts >= MAX_OTP_ATTEMPTS) {
      throw new AppError("Too many invalid OTP attempts", 429);
    }

    if (storedOtp !== otp) {
      await incrementOtpAttempts(email);

      throw new AppError("Invalid OTP", 400);
    }

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError(
        "An account with this email already exists. Please login.",
        409,
      );
    }

    const user = await userRepository.create({
      name: pendingRegistration.name,
      email: pendingRegistration.email,
      passwordHash: pendingRegistration.passwordHash,
      role: "RESIDENT",
      unitId: pendingRegistration.unitId,
    });

    await userRepository.updateVerificationStatus(user.id, true);

    await deleteOtp(email);
    await deletePendingRegistration(email);

    await sendOnboardingEmail(user.email, user.name);

    return toUserResponse(user);
  },

  async login(data: LoginInput) {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        tokenVersion: user.tokenVersion,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    return {
      user: toUserResponse(user),
      token,
    };
  },

  async getCurrentUser(userId: number) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 401);
    }

    return toUserResponse(user);
  },

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return {
        message: "Password reset instructions sent",
      };
    }

    const token = generateResetToken();

    await storeResetToken(user.id, token);

    await sendPasswordResetEmail(user.email, user.name, token);

    return {
      message: "Password reset instructions sent",
    };
  },

  async resetPassword(token: string, password: string) {
    const userId = await getResetTokenUserId(token);

    if (!userId) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await userRepository.updatePassword(userId, passwordHash);

    await userRepository.incrementTokenVersion(userId);

    await deleteResetToken(token);

    return {
      message: "Password reset successfully",
    };
  },

  async logout(userId: number) {
    await userRepository.incrementTokenVersion(userId);

    return {
      message: "Logout successful",
    };
  },
};

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
} from "./email.service.js";
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

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: "RESIDENT",
    });

    const otp = generateOtp();

    await storeOtp(user.id, otp);

    await sendOtpEmail(user.email, otp, user.name);

    return toUserResponse(user);
  },

  async resendOtp(email: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.emailVerified) {
      throw new Error("Email already verified");
    }

    const otp = generateOtp();

    await storeOtp(user.id, otp);

    await sendOtpEmail(user.email, otp, user.name);

    return {
      message: "OTP sent successfully",
    };
  },

  async verifyOtp(email: string, otp: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const storedOtp = await getOtp(user.id);

    if (!storedOtp) {
      throw new Error("OTP expired or not found");
    }

    if (storedOtp !== otp) {
      throw new Error("Invalid OTP");
    }

    await userRepository.updateVerificationStatus(user.id, true);

    await deleteOtp(user.id);

    return toUserResponse(user);
  },

  async login(data: LoginInput) {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error("Invalid Email or Password");
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new Error("Invalid Email or Password");
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
      return { message: "Password reset instructions sent" };
    }

    const token = generateResetToken();

    await storeResetToken(user.id, token);

    await sendPasswordResetEmail(user.email, user.name, token);

    return { message: "Password reset instructions sent" };
  },

  async resetPassword(token: string, password: string) {
    const userId = await getResetTokenUserId(token);

    if (!userId) {
      throw new Error("Invalid or expired reset token");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await userRepository.updatePassword(userId, passwordHash);

    await userRepository.incrementTokenVersion(userId);

    await deleteResetToken(token);

    return {
      message: "Password reset successfully",
    };
  },
};
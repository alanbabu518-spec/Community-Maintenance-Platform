import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { LoginInput, RegisterInput } from "./auth.types.js";
import { userRepository } from "../users/user.repository.js";
import { toUserResponse } from "../users/user.mapper.js";
import { generateOtp, storeOtp, getOtp, deleteOtp } from "../../utils/otp.js";

export const authService = {
  async register(data: RegisterInput) {
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
    });

    const otp = generateOtp();

    await storeOtp(user.id, otp);

    console.log("OTP:", otp);

    return toUserResponse(user);
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
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );

    return {
      user: toUserResponse(user),
      token,
    };
  },
};

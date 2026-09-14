import apiClient from "./apiClient";
import type {
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse,
  UserResponse,
  VerifyOtpInput,
  VerifyOtpResponse,
} from "../types/api";

export async function registerUser(
  data: RegisterInput,
): Promise<RegisterResponse> {
  return apiClient<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function verifyOtp(
  data: VerifyOtpInput,
): Promise<VerifyOtpResponse> {
  return apiClient<VerifyOtpResponse>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(
  data: LoginInput,
): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getCurrentUser(): Promise<{
  user: UserResponse;
}> {
  return apiClient<{ user: UserResponse }>("/auth/me");
}

export async function logoutUser(): Promise<{
  message: string;
}> {
  return apiClient<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}
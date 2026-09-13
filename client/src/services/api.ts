import type {
  HealthResponse,
  MaintenanceListResponse,
  LoginInput,
  LoginResponse,
} from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error("Failed to connect to backend");
  }

  return response.json();
}

export async function getMaintenanceRequests(): Promise<MaintenanceListResponse> {
  const response = await fetch(`${API_BASE_URL}/maintenance`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch maintenance requests");
  }

  return response.json();
}

export async function loginUser(data: LoginInput): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  return response.json();
}

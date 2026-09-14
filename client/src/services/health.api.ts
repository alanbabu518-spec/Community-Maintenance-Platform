import apiClient from "./apiClient";

export interface HealthResponse {
  status: string;
}

export async function getHealth(): Promise<HealthResponse> {
  return apiClient<HealthResponse>("/health");
}
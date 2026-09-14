import apiClient from "./apiClient";
import type { MaintenanceListResponse } from "../types/api";

export async function getMaintenanceRequests(): Promise<MaintenanceListResponse> {
  return apiClient<MaintenanceListResponse>("/maintenance");
}
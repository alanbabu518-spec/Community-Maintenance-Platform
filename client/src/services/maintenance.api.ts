import apiClient from "./apiClient";
import type { MaintenanceListResponse } from "../types/api";

export interface MaintenanceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?:
    | "OPEN"
    | "ACKNOWLEDGED"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  category?: string;
}

export async function getMaintenanceRequests(
  params?: MaintenanceQueryParams,
): Promise<MaintenanceListResponse> {
  return apiClient<MaintenanceListResponse>("/maintenance", {
    params: Object.fromEntries(
      Object.entries(params ?? {}).filter(([, value]) => value !== undefined),
    ) as Record<string, string>,
  });
}

export interface CreateMaintenanceRequestInput {
  title: string;
  description: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  unitId: number;
}

export async function createMaintenanceRequest(
  data: CreateMaintenanceRequestInput,
) {
  return apiClient("/maintenance", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

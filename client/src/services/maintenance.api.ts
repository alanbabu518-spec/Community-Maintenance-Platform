import apiClient from "./apiClient";
import type { MaintenanceListResponse } from "../types/api";

export interface MaintenanceQueryParams {
  page: number;
  limit?: number;
  search: string;
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

export interface MaintenanceRequestDetailResponse {
  request: {
    id: number;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    residentId: number;
    unitId: number;
    technicianId: number | null;
    createdAt: string;
    updatedAt: string;
    resident: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
    unit: {
      id: number;
      unitNumber: string;
      building: {
        id: number;
        name: string;
        community: {
          id: number;
          name: string;
          address: string;
        };
      };
    };
    technician: {
      id: number;
      name: string;
      email: string;
      role: string;
    } | null;
  };
}

export async function getMaintenanceRequests(
  params?: MaintenanceQueryParams,
): Promise<MaintenanceListResponse> {
  return apiClient<MaintenanceListResponse>("/maintenance", {
    params: Object.fromEntries(
      Object.entries(params ?? {}).filter(
        ([, value]) => value !== undefined,
      ),
    ) as Record<string, string>,
  });
}

export async function getMaintenanceRequest(
  id: number,
): Promise<MaintenanceRequestDetailResponse> {
  return apiClient<MaintenanceRequestDetailResponse>(
    `/maintenance/${id}`,
  );
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

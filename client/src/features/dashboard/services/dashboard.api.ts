import apiClient from "../../../services/apiClient";

export interface DashboardStats {
  totalRequests: number;
  openRequests: number;
  assignedRequests: number;
  resolvedRequests: number;
}

interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient<DashboardStatsResponse>("/dashboard/stats");

  return response.data;
};
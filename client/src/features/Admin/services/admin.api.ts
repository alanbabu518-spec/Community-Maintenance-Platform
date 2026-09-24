import apiClient from "../../../services/apiClient";

export interface AdminDashboardStats {
  residents: number;
  staff: number;
  openRequests: number;
  activeCommunities: number;

  acknowledgedRequests: number;
  assignedRequests: number;
  inProgressRequests: number;
  resolvedRequests: number;
  closedRequests: number;
  urgentRequests: number;
}

interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardStats;
}

export const getAdminDashboard = async (): Promise<AdminDashboardStats> => {
  const response = await apiClient<AdminDashboardResponse>("/admin/dashboard");

  return response.data;
};

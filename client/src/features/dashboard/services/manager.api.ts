import apiClient from "../../../services/apiClient";

export interface ManagerDashboardResponse {
  communityId: number;

  statistics: {
    totalRequests: number;
    openRequests: number;
    acknowledgedRequests: number;
    assignedRequests: number;
    inProgressRequests: number;
    resolvedRequests: number;
    closedRequests: number;
    urgentRequests: number;
  };

  recentRequests: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    status: string;
    priority: string;
    createdAt: string;
    resident: {
      id: number;
      name: string;
    };
    unit: {
      unitNumber: string;
      building: {
        name: string;
        community: {
          id: number;
          name: string;
        };
      };
    };
    technician: {
      id: number;
      name: string;
    } | null;
  }>;

  technicians: Array<{
    id: number;
    name: string;
    email: string;
  }>;
}

interface ManagerDashboardApiResponse {
  success: boolean;
  data: ManagerDashboardResponse;
}

export const getManagerDashboard =
  async (): Promise<ManagerDashboardResponse> => {
    const response =
      await apiClient<ManagerDashboardApiResponse>("/manager/dashboard");

    return response.data;
  };

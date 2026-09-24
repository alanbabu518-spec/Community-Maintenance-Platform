import apiClient from "../../../services/apiClient";

export interface AdminActivity {
  id: number;
  action: string;
  entity: string;
  entityId: number | null;
  metadata: unknown;
  createdAt: string;

  actor: {
    id: number;
    name: string;
    role: "ADMIN" | "MANAGER" | "RESIDENT" | "TECHNICIAN";
  };
}

interface AdminActivityResponse {
  success: boolean;
  data: AdminActivity[];
}

export const getAdminActivity = async (): Promise<AdminActivity[]> => {
  const response = await apiClient<AdminActivityResponse>("/admin/activity");

  return response.data;
};

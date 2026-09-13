export interface HealthResponse {
  status: string;
}

export interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status:
    | "OPEN"
    | "ACKNOWLEDGED"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED";
  residentId: number;
  unitId: number;
  technicianId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceListResponse {
  requests: MaintenanceRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "MANAGER" | "RESIDENT" | "TECHNICIAN";
}

export interface RegisterResponse {
  message: string;
  user: UserResponse;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "RESIDENT" | "TECHNICIAN";
}

export interface LoginResponse {
  message: string;
  user: UserResponse;
}
export type UserRole = "ADMIN" | "MANAGER" | "RESIDENT" | "TECHNICIAN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  communityId: number | null;
}

export interface UserFilters {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole;
  sortOrder: "asc" | "desc";
}

export interface UserPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UsersResponse {
  users: User[];
  pagination: UserPagination;
}

export interface CreateStaffInput {
  name: string;
  email: string;
  password: string;
  role: "MANAGER" | "TECHNICIAN";
  communityId: number;
}

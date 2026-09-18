import type { UserRole } from "@prisma/client";

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserFilters {
  page: number;
  limit: number;
  search?: string | undefined;
  role?: UserRole | undefined;
  sortOrder: "asc" | "desc";
}
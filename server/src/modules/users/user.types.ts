import type { UserRole } from "@prisma/client";

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "RESIDENT" | "TECHNICIAN";
  isActive: boolean;
  communityId: number | null;
  unitId: number | null;
  unitNumber: string | null;
}

export interface UserFilters {
  page: number;
  limit: number;
  search?: string | undefined;
  role?: UserRole | undefined;
  communityId?: number | undefined;
  sortOrder: "asc" | "desc";
}

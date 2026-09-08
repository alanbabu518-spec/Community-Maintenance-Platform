import type { UserRole } from "@prisma/client";

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
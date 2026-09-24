import type { UserResponse } from "./user.types.js";

type UserWithLocation = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "RESIDENT" | "TECHNICIAN";
  isActive: boolean;
  communityId?: number | null;
  unitId?: number | null;
  unit?: {
    unitNumber: string;
    building?: {
      communityId: number;
    } | null;
  } | null;
};

export function toUserResponse(user: UserWithLocation): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    communityId: user.communityId ?? user.unit?.building?.communityId ?? null,
    unitId: user.unitId ?? null,
    unitNumber: user.unit?.unitNumber ?? null,
  };
}

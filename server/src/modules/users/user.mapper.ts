import type { UserResponse } from "./user.types.js";

type UserWithLocation = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "RESIDENT" | "TECHNICIAN";
  communityId?: number | null;
  unit?: {
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
    communityId:
      user.communityId ??
      user.unit?.building?.communityId ??
      null,
  };
}
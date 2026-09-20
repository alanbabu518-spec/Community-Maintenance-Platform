import type { UserResponse } from "./user.types.js";

type UserForResponse = {
  id: number;
  name: string;
  email: string;
  role: "RESIDENT" | "ADMIN" | "MANAGER" | "TECHNICIAN";
  unit?: {
    building?: {
      communityId: number;
    } | null;
  } | null;
};

export function toUserResponse(user: UserForResponse): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    communityId: user.unit?.building?.communityId ?? null,
  };
}
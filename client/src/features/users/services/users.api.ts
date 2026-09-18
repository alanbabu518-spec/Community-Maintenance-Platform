import  apiClient  from "../../../services/apiClient";
import type {
  CreateStaffInput,
  UserFilters,
  UsersResponse,
} from "../types/user.types";

export async function getUsers(
  filters: UserFilters,
): Promise<UsersResponse> {
  const params = new URLSearchParams();

  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  params.set("sortOrder", filters.sortOrder);

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.role) {
    params.set("role", filters.role);
  }

  return apiClient<UsersResponse>(
    `/users?${params.toString()}`,
  );
}

export async function createStaff(
  data: CreateStaffInput,
) {
  return apiClient("/users/staff", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
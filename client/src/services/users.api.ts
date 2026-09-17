import apiClient from "./apiClient";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "RESIDENT" | "TECHNICIAN";
}

interface UsersResponse {
  users: User[];
}

export async function getUsers(): Promise<UsersResponse> {
  return apiClient<UsersResponse>("/users");
}

export async function getTechnicians(): Promise<User[]> {
  const response = await getUsers();

  return response.users.filter((user) => user.role === "TECHNICIAN");
}

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/users.api";
import { usersKeys } from "../users.keys";
import type { UserFilters } from "../types/user.types";

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: usersKeys.list(filters),
    queryFn: () => getUsers(filters),
    staleTime: 30 * 1000,
  });
}
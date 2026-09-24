import { useQuery } from "@tanstack/react-query";

import { getResidents } from "../services/users.api";

export function useResidents() {
  return useQuery({
    queryKey: ["residents"],
    queryFn: getResidents,
    staleTime: 30 * 1000,
  });
}
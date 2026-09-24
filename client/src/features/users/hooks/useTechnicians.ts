import { useQuery } from "@tanstack/react-query";

import { getTechnicians } from "../services/users.api";

export function useTechnicians() {
  return useQuery({
    queryKey: ["technicians"],
    queryFn: getTechnicians,
    staleTime: 30 * 1000,
  });
}
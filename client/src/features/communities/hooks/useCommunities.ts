import { useQuery } from "@tanstack/react-query";
import { getCommunities } from "../services/communities.api";

export const communitiesKeys = {
  all: ["communities"] as const,
  list: () => [...communitiesKeys.all, "list"] as const,
};

export function useCommunities() {
  return useQuery({
    queryKey: communitiesKeys.list(),
    queryFn: getCommunities,
    staleTime: 30 * 1000,
  });
}

import { useQuery } from "@tanstack/react-query";
import {
  getBuildings,
  type Building,
} from "../services/buildings.api";

export const buildingsKeys = {
  all: ["buildings"] as const,
  byCommunity: (communityId: number) =>
    [...buildingsKeys.all, "community", communityId] as const,
};

export function useBuildings(communityId: number) {
  return useQuery<Building[]>({
    queryKey: buildingsKeys.byCommunity(communityId),
    queryFn: () => getBuildings(communityId),
    enabled: communityId > 0,
    staleTime: 30 * 1000,
  });
}
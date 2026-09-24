import { useQuery } from "@tanstack/react-query";
import { getBuildingById, type Building } from "../services/buildings.api";

export const buildingKeys = {
  all: ["building"] as const,
  byId: (buildingId: number) => [...buildingKeys.all, buildingId] as const,
};

export function useBuilding(buildingId: number) {
  return useQuery<Building>({
    queryKey: buildingKeys.byId(buildingId),
    queryFn: () => getBuildingById(buildingId),
    enabled: buildingId > 0,
    staleTime: 30 * 1000,
  });
}

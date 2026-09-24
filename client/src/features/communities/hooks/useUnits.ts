import { useQuery } from "@tanstack/react-query";
import { getUnits, type Unit } from "../services/units.api";

export const unitsKeys = {
  all: ["units"] as const,
  byBuilding: (buildingId: number) =>
    [...unitsKeys.all, "building", buildingId] as const,
};

export function useUnits(buildingId: number) {
  return useQuery<Unit[]>({
    queryKey: unitsKeys.byBuilding(buildingId),
    queryFn: () => getUnits(buildingId),
    enabled: buildingId > 0,
    staleTime: 30 * 1000,
  });
}

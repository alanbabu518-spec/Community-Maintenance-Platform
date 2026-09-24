import { useQuery } from "@tanstack/react-query";
import {
  getManagerBuildings,
  getManagerCommunity,
  getManagerUnits,
} from "../services/managerCommunity.api";

export function useManagerCommunity() {
  return useQuery({
    queryKey: ["manager-community"],
    queryFn: getManagerCommunity,
  });
}

export function useManagerBuildings(communityId: number | undefined) {
  return useQuery({
    queryKey: ["manager-community-buildings", communityId],
    queryFn: () => getManagerBuildings(communityId!),
    enabled: Boolean(communityId),
  });
}

export function useManagerUnits(buildingId: number | undefined) {
  return useQuery({
    queryKey: ["manager-community-units", buildingId],
    queryFn: () => getManagerUnits(buildingId!),
    enabled: Boolean(buildingId),
  });
}
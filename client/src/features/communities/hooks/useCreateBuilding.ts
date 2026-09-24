import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBuilding,
  type Building,
} from "../services/buildings.api";
import { buildingsKeys } from "./useBuildings";

interface CreateBuildingInput {
  name: string;
  communityId: number;
}

export function useCreateBuilding() {
  const queryClient = useQueryClient();

  return useMutation<Building, Error, CreateBuildingInput>({
    mutationFn: createBuilding,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: buildingsKeys.byCommunity(variables.communityId),
      });
    },
  });
}
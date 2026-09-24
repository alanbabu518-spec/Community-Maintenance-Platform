import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUnit, type Unit } from "../services/units.api";
import { unitsKeys } from "./useUnits";

interface CreateUnitInput {
  unitNumber: string;
  buildingId: number;
}

export function useCreateUnit() {
  const queryClient = useQueryClient();

  return useMutation<Unit, Error, CreateUnitInput>({
    mutationFn: createUnit,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: unitsKeys.byBuilding(variables.buildingId),
      });
    },
  });
}
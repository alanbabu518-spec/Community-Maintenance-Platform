import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateMaintenanceRequest,
  type UpdateMaintenanceRequestInput,
} from "../services/maintenance.api";
import { maintenanceKeys } from "../maintenance.keys";

function useUpdateMaintenanceRequest(requestId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMaintenanceRequestInput) =>
      updateMaintenanceRequest(requestId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: maintenanceKeys.detail(requestId),
      });

      queryClient.invalidateQueries({
        queryKey: maintenanceKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}

export default useUpdateMaintenanceRequest;
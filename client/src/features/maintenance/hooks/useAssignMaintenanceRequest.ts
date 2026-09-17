import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  assignMaintenanceRequest,
  type AssignMaintenanceRequestInput,
} from "../services/maintenance.api";
import { maintenanceKeys } from "../maintenance.keys";

function useAssignMaintenanceRequest(requestId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignMaintenanceRequestInput) =>
      assignMaintenanceRequest(requestId, data),
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

export default useAssignMaintenanceRequest;
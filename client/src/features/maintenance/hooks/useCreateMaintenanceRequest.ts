import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMaintenanceRequest } from "../../../services/maintenance.api";
import { maintenanceKeys } from "../maintenance.keys";

function useCreateMaintenanceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMaintenanceRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: maintenanceKeys.all,
      });
    },
  });
}

export default useCreateMaintenanceRequest;
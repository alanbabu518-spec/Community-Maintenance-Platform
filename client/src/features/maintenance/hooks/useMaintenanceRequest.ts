import { useQuery } from "@tanstack/react-query";
import { getMaintenanceRequest } from "../services/maintenance.api";
import { maintenanceKeys } from "../maintenance.keys";

function useMaintenanceRequest(id: number) {
  return useQuery({
    queryKey: maintenanceKeys.detail(id),
    queryFn: () => getMaintenanceRequest(id),
    enabled: id > 0,
  });
}

export default useMaintenanceRequest;
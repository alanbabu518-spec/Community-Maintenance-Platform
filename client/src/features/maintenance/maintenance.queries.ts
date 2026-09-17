import { getMaintenanceRequests } from "../../features/maintenance/services/maintenance.api";
import type { MaintenanceQueryParams} from "../../features/maintenance/services/maintenance.api";
import { maintenanceKeys } from "./maintenance.keys";

export const MAINTENANCE_PAGE_SIZE = 10;

export function maintenanceListQuery(params: MaintenanceQueryParams) {
  return {
    queryKey: maintenanceKeys.list(params),
    queryFn: () =>
      getMaintenanceRequests({
        status: params.status,
        page: params.page,
        limit: MAINTENANCE_PAGE_SIZE,
        search: params.search,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      }),
    staleTime: 30 * 1000,
    placeholderData: (previousData: any) => previousData,
  };
}

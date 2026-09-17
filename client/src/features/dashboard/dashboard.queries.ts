import { getMaintenanceRequests } from "../maintenance/services/maintenance.api";
import { dashboardKeys } from "./dashboard.keys";

export const dashboardMaintenanceQuery = () => ({
  queryKey: dashboardKeys.maintenance(),
  queryFn: () =>
    getMaintenanceRequests({
      page: 1,
      limit: 5,
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
  staleTime: 30 * 1000,
});
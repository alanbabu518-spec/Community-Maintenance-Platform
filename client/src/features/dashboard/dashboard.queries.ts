import { getMaintenanceRequests } from "../../services/maintenance.api";

export const dashboardMaintenanceQuery = () => ({
  queryKey: ["dashboard", "maintenance"],
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
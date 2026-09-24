import { getAdminDashboard } from "./services/admin.api";
import { adminKeys } from "./admin.keys";

export const adminDashboardQuery = () => ({
  queryKey: adminKeys.dashboard(),
  queryFn: getAdminDashboard,
  staleTime: 30 * 1000,
});
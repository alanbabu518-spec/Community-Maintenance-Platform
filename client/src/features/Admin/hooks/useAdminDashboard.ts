import { useQuery } from "@tanstack/react-query";

import { adminDashboardQuery } from "../admin.queries";

export const useAdminDashboard = () => {
  return useQuery(adminDashboardQuery());
};

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../services/dashboard.api";
import { dashboardKeys } from "../dashboard.keys";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
    staleTime: 30 * 1000,
  });
};
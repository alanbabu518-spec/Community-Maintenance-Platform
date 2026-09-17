import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../services/dashboard.api";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
    staleTime: 30 * 1000,
  });
};
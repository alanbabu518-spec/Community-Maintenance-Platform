import { useQuery } from "@tanstack/react-query";
import { getManagerDashboard } from "../dashboard/services/manager.api";

export const managerDashboardKeys = {
  all: ["manager-dashboard"] as const,
};

export function useManagerDashboard() {
  return useQuery({
    queryKey: managerDashboardKeys.all,
    queryFn: getManagerDashboard,
  });
}
import { useQuery } from "@tanstack/react-query";
import { getTechnicianDashboard } from "../services/maintenance.api";

export function useTechnicianDashboard() {
  return useQuery({
    queryKey: ["technician-dashboard"],
    queryFn: getTechnicianDashboard,
    staleTime: 30 * 1000,
  });
}
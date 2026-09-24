import { useQuery } from "@tanstack/react-query";
import { getAdminActivity } from "../services/admin.activity.api";

export const useAdminActivity = () => {
  return useQuery({
    queryKey: ["admin", "activity"],
    queryFn: getAdminActivity,
    staleTime: 30 * 1000,
  });
};
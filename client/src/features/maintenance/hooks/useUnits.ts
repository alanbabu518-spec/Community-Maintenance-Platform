import { useQuery } from "@tanstack/react-query";
import { getUnits } from "../services/maintenance.api";

function useUnits() {
  return useQuery({
    queryKey: ["maintenance-units"],
    queryFn: getUnits,
    staleTime: 5 * 60 * 1000,
  });
}

export default useUnits;

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { maintenanceListQuery } from "../maintenance.queries";

interface UseMaintenanceRequestsParams {
  status?:
    | "OPEN"
    | "ACKNOWLEDGED"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED";
  page: number;
  search: string;
}

function useMaintenanceRequests(params: UseMaintenanceRequestsParams) {
  const queryClient = useQueryClient();

  const query = useQuery(maintenanceListQuery(params));

  useEffect(() => {
    if (
      query.data &&
      params.page < query.data.pagination.totalPages
    ) {
      queryClient.prefetchQuery(
        maintenanceListQuery({
          ...params,
          page: params.page + 1,
        }),
      );
    }
  }, [
    query.data,
    params,
    queryClient,
  ]);

  return query;
}

export default useMaintenanceRequests;
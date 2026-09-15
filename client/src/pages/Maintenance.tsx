import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getMaintenanceRequests } from "../services/maintenance.api";
import MaintenanceCard from "../features/maintenance/components/MaintenanceCard";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import PageTransition from "../components/ui/PageTransition";
import useDebounce from "../hooks/useDebounce";

function Maintenance() {
  const [status, setStatus] = useState<
    | "OPEN"
    | "ACKNOWLEDGED"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED"
    | undefined
  >(undefined);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: [
      "maintenance-requests",
      { status, page, search: debouncedSearch },
    ],
    queryFn: () =>
      getMaintenanceRequests({
        status,
        page,
        limit: 10,
        search: debouncedSearch,
      }),
    staleTime: 30 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const requests = data?.requests ?? [];

  if (isLoading) {
    return <Loading type="list" />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={
          error instanceof Error
            ? error.message
            : "Failed to load maintenance requests"
        }
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <PageTransition>
      <div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search maintenance requests..."
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            className="w-full rounded-md border px-4 py-2"
          />
        </div>
        <select
          value={status ?? ""}
          onChange={(event) => {
            setPage(1);

            setStatus(
              event.target.value === ""
                ? undefined
                : (event.target.value as
                    | "OPEN"
                    | "ACKNOWLEDGED"
                    | "ASSIGNED"
                    | "IN_PROGRESS"
                    | "RESOLVED"
                    | "CLOSED"),
            );
          }}
        >
          <option value="">All</option>
          <option value="OPEN">Open</option>
          <option value="ACKNOWLEDGED">Acknowledged</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        <h1>Maintenance Requests</h1>

        {requests.length === 0 ? (
          <p>No maintenance requests found.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <MaintenanceCard key={request.id} request={request} />
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => setPage((currentPage) => currentPage - 1)}
            disabled={page === 1}
          >
            Previous
          </button>

          <span>
            Page {data?.pagination.page ?? page} of{" "}
            {data?.pagination.totalPages ?? 1}
          </span>

          <button
            type="button"
            onClick={() => setPage((currentPage) => currentPage + 1)}
            disabled={page >= (data?.pagination.totalPages ?? 1)}
          >
            Next
          </button>
        </div>
        {isFetching && !isLoading && (
          <p className="mt-2 text-sm text-gray-500">Loading...</p>
        )}
      </div>
    </PageTransition>
  );
}

export default Maintenance;

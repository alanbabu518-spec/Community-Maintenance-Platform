import useMaintenanceRequests from "../features/maintenance/hooks/useMaintenanceRequests";
import { useState, useEffect } from "react";
import MaintenanceCard from "../features/maintenance/components/MaintenanceCard";
import Loading from "../components/ui/Loading";
import PageTransition from "../components/ui/PageTransition";
import useDebounce from "../hooks/useDebounce";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ErrorPage from "../components/ui/ErrorPage";
import { ApiError } from "../services/apiClient";

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

  const location = useLocation();

  const successMessage = location.state?.successMessage;
  const successDescription = location.state?.successDescription;
  const [showSuccess, setShowSuccess] = useState(Boolean(successMessage));

  const navigate = useNavigate();

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setShowSuccess(false);
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [successMessage]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  const { data, isLoading, isFetching, isError, error, refetch } =
  useMaintenanceRequests({
    status,
    page,
    search: debouncedSearch,
  });

const requests = data?.requests ?? [];

if (isLoading) {
  return <Loading type="list" />;
}

if (isError) {
  const status = error instanceof ApiError ? error.status : 0;

  if (status === 401) {
    return (
      <ErrorPage
        errorCode="401"
        title="Session Expired"
        message="Your session has expired. Please log in again."
        onBack={() => navigate("/login")}
      />
    );
  }

  if (status === 403) {
    return (
      <ErrorPage
        errorCode="403"
        title="Access Denied"
        message="You don't have permission to view these maintenance requests."
        onBack={() => navigate("/dashboard")}
      />
    );
  }

  if (status === 500) {
    return (
      <ErrorPage
        errorCode="500"
        title="Server Error"
        message="The maintenance service encountered a problem. Please try again later."
        onRetry={() => refetch()}
        onBack={() => navigate("/dashboard")}
      />
    );
  }

  return (
    <ErrorPage
      errorCode={status === 0 ? "NETWORK" : String(status)}
      title="Unable to Connect"
      message="We couldn't connect to the maintenance service. Please check your connection and try again."
      onRetry={() => refetch()}
      onBack={() => navigate("/dashboard")}
    />
  );
}
  return (
    <PageTransition>
      <div>
        {showSuccess && successMessage && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-800">
              {successMessage}
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              {successDescription}
            </p>
          </div>
        )}
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

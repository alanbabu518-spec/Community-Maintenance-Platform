import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useMaintenanceRequests from "../features/maintenance/hooks/useMaintenanceRequests";
import MaintenanceCard from "../features/maintenance/components/MaintenanceCard";
import Loading from "../components/ui/Loading";
import PageTransition from "../components/ui/PageTransition";
import useDebounce from "../hooks/useDebounce";
import ErrorPage from "../components/ui/ErrorPage";
import { ApiError } from "../services/apiClient";

type MaintenanceStatus =
  | "OPEN"
  | "ACKNOWLEDGED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

type SortBy = "createdAt" | "priority";
type SortOrder = "asc" | "desc";

function Maintenance() {
  const [status, setStatus] = useState<MaintenanceStatus | undefined>(
    undefined,
  );

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const location = useLocation();
  const navigate = useNavigate();

  const successMessage = location.state?.successMessage;
  const successDescription = location.state?.successDescription;

  const [showSuccess, setShowSuccess] = useState(Boolean(successMessage));

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
    setPage(1);
  }, [debouncedSearch, status, sortBy, sortOrder]);

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
      sortBy,
      sortOrder,
    });

  const requests = data?.requests ?? [];
  const totalRequests = data?.pagination.total ?? 0;
  const totalPages = data?.pagination.totalPages ?? 1;

  if (isLoading) {
    return <Loading type="list" />;
  }

  if (isError) {
    const errorStatus = error instanceof ApiError ? error.status : 0;

    if (errorStatus === 401) {
      return (
        <ErrorPage
          errorCode="401"
          title="Session Expired"
          message="Your session has expired. Please log in again."
          onBack={() => navigate("/login")}
        />
      );
    }

    if (errorStatus === 403) {
      return (
        <ErrorPage
          errorCode="403"
          title="Access Denied"
          message="You don't have permission to view these maintenance requests."
          onBack={() => navigate("/dashboard")}
        />
      );
    }

    if (errorStatus === 500) {
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
        errorCode={errorStatus === 0 ? "NETWORK" : String(errorStatus)}
        title="Unable to Connect"
        message="We couldn't connect to the maintenance service. Please check your connection and try again."
        onRetry={() => refetch()}
        onBack={() => navigate("/dashboard")}
      />
    );
  }

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-") as [SortBy, SortOrder];

    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {showSuccess && successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <svg
                  className="h-4 w-4 text-emerald-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  {successMessage}
                </p>

                {successDescription && (
                  <p className="mt-1 text-sm leading-6 text-emerald-700">
                    {successDescription}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Community Management
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Maintenance Requests
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              View, search, filter, and track maintenance issues reported in the
              community.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/maintenance/new")}
            className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            Report an Issue
          </button>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />

            <h2 className="text-sm font-semibold text-slate-900">
              Find Requests
            </h2>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="md:col-span-2 xl:col-span-1">
              <label
                htmlFor="maintenance-search"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Search
              </label>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="maintenance-search"
                  type="text"
                  placeholder="Search requests..."
                  value={search}
                  onChange={(event) => {
                    setPage(1);
                    setSearch(event.target.value);
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="maintenance-status"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Status
              </label>

              <select
                id="maintenance-status"
                value={status ?? ""}
                onChange={(event) => {
                  setPage(1);

                  setStatus(
                    event.target.value === ""
                      ? undefined
                      : (event.target.value as MaintenanceStatus),
                  );
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="">All Status</option>
                <option value="OPEN">Open</option>
                <option value="ACKNOWLEDGED">Acknowledged</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="maintenance-sort"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Sort By
              </label>

              <select
                id="maintenance-sort"
                value={`${sortBy}-${sortOrder}`}
                onChange={(event) => handleSortChange(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="createdAt-desc">Newest first</option>
                <option value="createdAt-asc">Oldest first</option>
                <option value="priority-desc">Highest priority</option>
                <option value="priority-asc">Lowest priority</option>
              </select>
            </div>
          </div>

          {(search ||
            status ||
            sortBy !== "createdAt" ||
            sortOrder !== "desc") && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
              <span className="text-xs font-medium text-slate-500">
                Active filters:
              </span>

              {search && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Search: {search}
                </span>
              )}

              {status && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Status: {status}
                </span>
              )}

              {sortBy === "priority" && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Priority sorting
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatus(undefined);
                  setSortBy("createdAt");
                  setSortOrder("desc");
                  setPage(1);
                }}
                className="ml-auto text-xs font-semibold text-slate-600 transition hover:text-slate-900"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {totalRequests} {totalRequests === 1 ? "request" : "requests"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Showing page {data?.pagination.page ?? page} of {totalPages}
            </p>
          </div>

          {isFetching && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
              Updating results...
            </div>
          )}
        </section>

        {requests.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-5 w-5 text-slate-500" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No maintenance requests found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try changing your search or filters. If there are no requests yet,
              you can report a new maintenance issue.
            </p>

            <button
              type="button"
              onClick={() => navigate("/maintenance/new")}
              className="mt-5 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Report an Issue
            </button>
          </section>
        ) : (
          <section className="space-y-4">
            {requests.map((request) => (
              <MaintenanceCard key={request.id} request={request} />
            ))}
          </section>
        )}

        {requests.length > 0 && (
          <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-900">
                {data?.pagination.page ?? page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage - 1)}
                disabled={page === 1}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="min-w-10 rounded-lg bg-slate-900 px-3 py-2 text-center text-sm font-semibold text-white">
                {page}
              </div>

              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
}

export default Maintenance;

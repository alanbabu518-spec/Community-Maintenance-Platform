import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ListFilter,
  X,
} from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useMaintenanceRequests from "../features/maintenance/hooks/useMaintenanceRequests";
import MaintenanceCard from "../features/maintenance/components/MaintenanceCard";
import Loading from "../components/ui/Loading";
import PageTransition from "../components/ui/PageTransition";
import useDebounce from "../hooks/useDebounce";
import ErrorPage from "../components/ui/ErrorPage";
import { ApiError } from "../services/apiClient";
import { useAuth } from "../context/AuthContext";

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
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";

  const statusParam = searchParams.get("status");

  const status: MaintenanceStatus | undefined =
    statusParam === "OPEN" ||
    statusParam === "ACKNOWLEDGED" ||
    statusParam === "ASSIGNED" ||
    statusParam === "IN_PROGRESS" ||
    statusParam === "RESOLVED" ||
    statusParam === "CLOSED"
      ? statusParam
      : undefined;

  const debouncedSearch = useDebounce(search, 500);

  const sortByParam = searchParams.get("sortBy");
  const sortOrderParam = searchParams.get("sortOrder");

  const { user } = useAuth();
  const canReportIssue = user?.role === "RESIDENT";

  const sortBy: SortBy =
    sortByParam === "priority" ? "priority" : "createdAt";

  const sortOrder: SortOrder =
    sortOrderParam === "asc" ? "asc" : "desc";

  const pageParam = searchParams.get("page");

  const page =
    pageParam && /^\d+$/.test(pageParam)
      ? Math.max(1, Number(pageParam))
      : 1;

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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useMaintenanceRequests({
    status,
    page,
    search: debouncedSearch,
    sortBy,
    sortOrder,
  });

  useEffect(() => {
    const validStatuses = [
      "OPEN",
      "ACKNOWLEDGED",
      "ASSIGNED",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
    ];

    const validSortBy = ["createdAt", "priority"];
    const validSortOrder = ["asc", "desc"];

    const hasInvalidStatus =
      statusParam !== null && !validStatuses.includes(statusParam);

    const hasInvalidSortBy =
      sortByParam !== null && !validSortBy.includes(sortByParam);

    const hasInvalidSortOrder =
      sortOrderParam !== null && !validSortOrder.includes(sortOrderParam);

    if (!hasInvalidStatus && !hasInvalidSortBy && !hasInvalidSortOrder) {
      return;
    }

    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (hasInvalidStatus) {
        nextParams.delete("status");
      }

      if (hasInvalidSortBy) {
        nextParams.delete("sortBy");
      }

      if (hasInvalidSortOrder) {
        nextParams.delete("sortOrder");
      }

      nextParams.delete("page");

      return nextParams;
    });
  }, [
    statusParam,
    sortByParam,
    sortOrderParam,
    setSearchParams,
  ]);

  const requests = data?.requests ?? [];
  const totalRequests = data?.pagination.total ?? 0;
  const totalPages = data?.pagination.totalPages ?? 1;

  useEffect(() => {
    if (isLoading || isFetching) return;

    if (page > totalPages) {
      setSearchParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);

        if (totalPages === 1) {
          nextParams.delete("page");
        } else {
          nextParams.set("page", String(totalPages));
        }

        return nextParams;
      });
    }
  }, [
    page,
    totalPages,
    isLoading,
    isFetching,
    setSearchParams,
  ]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    if (newPage > totalPages) return;

    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (newPage === 1) {
        nextParams.delete("page");
      } else {
        nextParams.set("page", String(newPage));
      }

      return nextParams;
    });
  };

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
    const [newSortBy, newSortOrder] = value.split("-") as [
      SortBy,
      SortOrder,
    ];

    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (newSortBy === "createdAt" && newSortOrder === "desc") {
        nextParams.delete("sortBy");
        nextParams.delete("sortOrder");
      } else {
        nextParams.set("sortBy", newSortBy);
        nextParams.set("sortOrder", newSortOrder);
      }

      nextParams.delete("page");

      return nextParams;
    });
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {showSuccess && successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                <CheckCircle2
                  className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                  strokeWidth={2.25}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  {successMessage}
                </p>

                {successDescription && (
                  <p className="mt-1 text-sm leading-6 text-emerald-700 dark:text-emerald-400">
                    {successDescription}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Community Management
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Maintenance Requests
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              View, search, filter, and track maintenance issues reported in the
              community.
            </p>
          </div>

          {canReportIssue && (
            <button
              type="button"
              onClick={() => navigate("/maintenance/new")}
              className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:w-auto"
            >
              Report an Issue
            </button>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <SlidersHorizontal className="h-4 w-4" strokeWidth={2.25} />
            </div>

            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Find Requests
            </h2>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="md:col-span-2 xl:col-span-1">
              <label
                htmlFor="maintenance-search"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              >
                Search
              </label>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

                <input
                  id="maintenance-search"
                  type="text"
                  placeholder="Search requests..."
                  value={search}
                  onChange={(event) => {
                    const value = event.target.value;

                    setSearchParams((currentParams) => {
                      const nextParams = new URLSearchParams(currentParams);

                      if (value.trim()) {
                        nextParams.set("search", value);
                      } else {
                        nextParams.delete("search");
                      }

                      nextParams.delete("page");

                      return nextParams;
                    });
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white dark:focus:ring-white/10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="maintenance-status"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              >
                Status
              </label>

              <select
                id="maintenance-status"
                value={status ?? ""}
                onChange={(event) => {
                  const value = event.target.value;

                  setSearchParams((currentParams) => {
                    const nextParams = new URLSearchParams(currentParams);

                    if (value) {
                      nextParams.set("status", value);
                    } else {
                      nextParams.delete("status");
                    }

                    nextParams.delete("page");

                    return nextParams;
                  });
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
              >
                <option value="">All Statuses</option>
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
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              >
                Sort By
              </label>

              <select
                id="maintenance-sort"
                value={`${sortBy}-${sortOrder}`}
                onChange={(event) => handleSortChange(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
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
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                <ListFilter className="h-3.5 w-3.5" />
                Active filters:
              </span>

              {search && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Search: {search}
                </span>
              )}

              {status && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Status: {status}
                </span>
              )}

              {sortBy === "priority" && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Priority sorting
                </span>
              )}

              <button
                type="button"
                onClick={handleClearFilters}
                className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {totalRequests}{" "}
              {totalRequests === 1 ? "request" : "requests"}
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Showing page {data?.pagination.page ?? page} of {totalPages}
            </p>
          </div>

          {isFetching && (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-slate-700 dark:border-t-white" />
              Updating results...
            </div>
          )}
        </section>

        {requests.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <Search className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              No maintenance requests found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Try changing your search or filters. New maintenance requests
              will appear here when available.
            </p>

            {canReportIssue && (
              <button
                type="button"
                onClick={() => navigate("/maintenance/new")}
                className="mt-5 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Report an Issue
              </button>
            )}
          </section>
        ) : (
          <section className="space-y-4">
            {requests.map((request) => (
              <MaintenanceCard key={request.id} request={request} />
            ))}
          </section>
        )}

        {requests.length > 0 && (
          <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Page{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {data?.pagination.page ?? page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="min-w-10 rounded-lg bg-slate-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm dark:bg-white dark:text-slate-900">
                {page}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
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
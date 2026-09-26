import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  CircleDot,
  Clock3,
  LoaderCircle,
  Wrench,
} from "lucide-react";

import { useAdminDashboard } from "../hooks/useAdminDashboard";

function MaintenanceOverview() {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 w-52 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          </div>

          <div className="hidden h-10 w-24 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800 sm:block" />
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
            />
          ))}
        </div>

        <div className="mt-7 h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/40 dark:bg-red-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-red-800 dark:text-red-300">
              Unable to load maintenance overview
            </h2>

            <p className="mt-1 text-sm text-red-700/80 dark:text-red-400/80">
              Please refresh the page and try again.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const requests = [
    {
      label: "Open",
      value: data.openRequests,
      icon: CircleDot,
      iconClass:
        "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
      barClass: "bg-blue-500",
    },
    {
      label: "Acknowledged",
      value: data.acknowledgedRequests,
      icon: Clock3,
      iconClass:
        "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
      barClass: "bg-amber-500",
    },
    {
      label: "Assigned",
      value: data.assignedRequests,
      icon: Wrench,
      iconClass:
        "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
      barClass: "bg-violet-500",
    },
    {
      label: "In Progress",
      value: data.inProgressRequests,
      icon: LoaderCircle,
      iconClass:
        "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
      barClass: "bg-orange-500",
    },
    {
      label: "Resolved",
      value: data.resolvedRequests,
      icon: CheckCircle2,
      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
      barClass: "bg-emerald-500",
    },
    {
      label: "Closed",
      value: data.closedRequests,
      icon: CheckCircle2,
      iconClass:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
      barClass: "bg-slate-500",
    },
  ];

  const totalRequests = requests.reduce(
    (total, request) => total + request.value,
    0,
  );

  const maxValue = Math.max(
    ...requests.map((request) => request.value),
    1,
  );

  const activeRequests =
    data.openRequests +
    data.acknowledgedRequests +
    data.assignedRequests +
    data.inProgressRequests;

  const completionRate =
    totalRequests > 0
      ? Math.round(
          ((data.resolvedRequests + data.closedRequests) / totalRequests) *
            100,
        )
      : 0;

  const urgentPercentage =
    totalRequests > 0
      ? Math.round((data.urgentRequests / totalRequests) * 100)
      : 0;

  const dominantStatus = [...requests].sort(
    (a, b) => b.value - a.value,
  )[0];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <BarChart3 className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Maintenance Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Current request distribution and operational status.
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm dark:border-red-900/40 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-500" />

          <span className="font-semibold text-red-700 dark:text-red-400">
            {data.urgentRequests}
          </span>

          <span className="text-red-600/80 dark:text-red-400/80">
            urgent
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 border-b border-slate-200 sm:grid-cols-4 dark:border-slate-800">
        <div className="border-r border-slate-200 p-5 dark:border-slate-800">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Total Requests
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {totalRequests.toLocaleString()}
          </p>
        </div>

        <div className="border-r border-slate-200 p-5 dark:border-slate-800 sm:border-r-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Active
          </p>

          <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {activeRequests.toLocaleString()}
          </p>
        </div>

        <div className="border-r border-t border-slate-200 p-5 dark:border-slate-800 sm:border-t-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Completed
          </p>

          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {completionRate}%
          </p>
        </div>

        <div className="border-t border-slate-200 p-5 dark:border-slate-800 sm:border-t-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Urgent Rate
          </p>

          <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
            {urgentPercentage}%
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Request Status
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Distribution of maintenance requests across each workflow stage.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {requests.map((request) => {
            const Icon = request.icon;

            const percentage =
              totalRequests > 0
                ? Math.round((request.value / totalRequests) * 100)
                : 0;

            const width =
              request.value === 0
                ? 0
                : Math.max((request.value / maxValue) * 100, 4);

            return (
              <div
                key={request.label}
                className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${request.iconClass}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {request.label}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                        {percentage}% of requests
                      </p>
                    </div>
                  </div>

                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {request.value.toLocaleString()}
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${request.barClass}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-5 dark:bg-slate-800/50">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
              <BarChart3 className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Operational Analysis
              </h3>

              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                <p>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {dominantStatus.label}
                  </span>{" "}
                  currently has the highest number of requests with{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {dominantStatus.value.toLocaleString()}
                  </span>{" "}
                  requests.
                </p>

                <p>
                  There are currently{" "}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {activeRequests.toLocaleString()}
                  </span>{" "}
                  active requests that still require attention.
                </p>

                <p>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {completionRate}%
                  </span>{" "}
                  of all requests are resolved or closed, while{" "}
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    {data.urgentRequests.toLocaleString()}
                  </span>{" "}
                  requests are marked as urgent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MaintenanceOverview;
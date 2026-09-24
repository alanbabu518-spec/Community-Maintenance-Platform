import { AlertTriangle } from "lucide-react";

import { useAdminDashboard } from "../hooks/useAdminDashboard";

function MaintenanceOverview() {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="h-6 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        <div className="mt-6 space-y-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="mb-2 h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
        Unable to load maintenance overview.
      </section>
    );
  }

  const requests = [
    {
      label: "Open",
      value: data.openRequests,
    },
    {
      label: "Acknowledged",
      value: data.acknowledgedRequests,
    },
    {
      label: "Assigned",
      value: data.assignedRequests,
    },
    {
      label: "In Progress",
      value: data.inProgressRequests,
    },
    {
      label: "Resolved",
      value: data.resolvedRequests,
    },
    {
      label: "Closed",
      value: data.closedRequests,
    },
  ];

  const maxValue = Math.max(...requests.map((request) => request.value), 1);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Maintenance Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Request distribution by current status.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <AlertTriangle className="h-4 w-4" />
          {data.urgentRequests} urgent
        </div>
      </div>

      <div className="mt-7 space-y-5">
        {requests.map((request) => {
          const width =
            request.value === 0
              ? 0
              : Math.max((request.value / maxValue) * 100, 4);

          return (
            <div key={request.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {request.label}
                </span>

                <span className="font-semibold text-slate-900 dark:text-white">
                  {request.value.toLocaleString()}
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-slate-700 transition-all dark:bg-slate-300"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default MaintenanceOverview;
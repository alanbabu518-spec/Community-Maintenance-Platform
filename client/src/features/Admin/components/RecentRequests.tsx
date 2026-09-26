import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileText,
  Wrench,
} from "lucide-react";

import { dashboardMaintenanceQuery } from "../../dashboard/dashboard.queries";

function getPriorityStyle(priority: string) {
  const value = priority.toLowerCase();

  if (value === "urgent" || value === "critical") {
    return {
      className:
        "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900/40",
      icon: AlertTriangle,
    };
  }

  if (value === "high") {
    return {
      className:
        "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:ring-orange-900/40",
      icon: AlertTriangle,
    };
  }

  if (value === "medium") {
    return {
      className:
        "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-900/40",
      icon: Clock3,
    };
  }

  return {
    className:
      "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    icon: Clock3,
  };
}

function getStatusStyle(status: string) {
  const value = status.toLowerCase();

  if (value.includes("resolved") || value.includes("closed")) {
    return {
      className:
        "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-900/40",
      icon: CheckCircle2,
    };
  }

  if (value.includes("progress")) {
    return {
      className:
        "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:ring-blue-900/40",
      icon: Wrench,
    };
  }

  if (value.includes("assigned")) {
    return {
      className:
        "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:ring-violet-900/40",
      icon: Wrench,
    };
  }

  if (value.includes("acknowledged")) {
    return {
      className:
        "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-900/40",
      icon: Clock3,
    };
  }

  return {
    className:
      "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    icon: Clock3,
  };
}

function RecentRequests() {
  const { data, isLoading, isError } = useQuery(dashboardMaintenanceQuery());

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="space-y-3 p-5 sm:p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/40 dark:bg-red-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-red-800 dark:text-red-300">
              Unable to load recent requests
            </h2>

            <p className="mt-1 text-sm text-red-700/80 dark:text-red-400/80">
              Please refresh the page and try again.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const requests = data.requests.slice(0, 5);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <Wrench className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Maintenance
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Latest maintenance requests across the platform.
            </p>
          </div>
        </div>

        <Link
          to="/maintenance"
          className="group inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <Wrench className="h-7 w-7" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
            No maintenance requests
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            New maintenance requests will appear here when they are submitted.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-left dark:border-slate-800 dark:bg-slate-800/40">
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Request
                  </th>

                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Community
                  </th>

                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Priority
                  </th>

                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {requests.map((request) => {
                  const priority = getPriorityStyle(request.priority);
                  const status = getStatusStyle(request.status);

                  const PriorityIcon = priority.icon;
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={request.id}
                      className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <FileText className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-xs truncate text-sm font-semibold text-slate-900 dark:text-white">
                              {request.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {request.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {request.community.name}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${priority.className}`}
                        >
                          <PriorityIcon className="h-3.5 w-3.5" />
                          {request.priority}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${status.className}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
            {requests.map((request) => {
              const priority = getPriorityStyle(request.priority);
              const status = getStatusStyle(request.status);

              const PriorityIcon = priority.icon;
              const StatusIcon = status.icon;

              return (
                <div
                  key={request.id}
                  className="p-5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <FileText className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {request.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {request.category}
                      </p>

                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                        {request.community.name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${priority.className}`}
                    >
                      <PriorityIcon className="h-3.5 w-3.5" />
                      {request.priority}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${status.className}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {request.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

export default RecentRequests;
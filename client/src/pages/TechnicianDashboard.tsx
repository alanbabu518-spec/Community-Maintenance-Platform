import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  ClipboardList,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";

import PageTransition from "../components/ui/PageTransition";
import { useTechnicianDashboard } from "../features/maintenance/hooks/useTechnicianDashboard";

function TechnicianDashboard() {
  const { data, isLoading, isError } = useTechnicianDashboard();

  if (isLoading) {
    return (
      <PageTransition>
        <div className="mx-auto w-full max-w-7xl space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="space-y-3">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-96 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>

          <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />

          <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
        </div>
      </PageTransition>
    );
  }

  if (isError || !data) {
    return (
      <PageTransition>
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                  Unable to load technician dashboard
                </p>

                <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/80">
                  Please check your connection and try again later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const stats = [
    {
      label: "Assigned",
      value: data.statistics.assignedRequests,
      description: "Requests assigned to you",
      icon: Wrench,
      accent: "blue",
    },
    {
      label: "In Progress",
      value: data.statistics.inProgressRequests,
      description: "Currently being worked on",
      icon: Clock3,
      accent: "amber",
    },
    {
      label: "Resolved",
      value: data.statistics.resolvedRequests,
      description: "Successfully completed",
      icon: CheckCircle2,
      accent: "emerald",
    },
    {
      label: "Urgent",
      value: data.statistics.urgentRequests,
      description: "Requires immediate attention",
      icon: AlertTriangle,
      accent: "red",
    },
  ];

  const totalWorkload =
    data.statistics.assignedRequests +
    data.statistics.inProgressRequests +
    data.statistics.resolvedRequests;

  const resolvedPercentage =
    totalWorkload > 0
      ? Math.round(
          (data.statistics.resolvedRequests / totalWorkload) * 100,
        )
      : 0;

  const inProgressPercentage =
    totalWorkload > 0
      ? Math.round(
          (data.statistics.inProgressRequests / totalWorkload) * 100,
        )
      : 0;

  const assignedPercentage =
    totalWorkload > 0
      ? Math.round(
          (data.statistics.assignedRequests / totalWorkload) * 100,
        )
      : 0;

  const urgentPercentage =
    totalWorkload > 0
      ? Math.round(
          (data.statistics.urgentRequests / totalWorkload) * 100,
        )
      : 0;

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-slate-100 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 sm:p-8">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />
          <div className="absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-amber-500/5 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <Wrench className="h-4 w-4" />
                </div>

                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Technician Operations
                </p>
              </div>

              <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Technician Dashboard
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                View your assigned maintenance workload, track progress, and
                stay focused on requests that need your attention.
              </p>
            </div>

            <Link
              to="/maintenance"
              className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:w-auto"
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              View Requests
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            const accentStyles = {
              blue: {
                icon: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
              },
              amber: {
                icon: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
              },
              emerald: {
                icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
              },
              red: {
                icon: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
              },
            };

            const styles =
              accentStyles[stat.accent as keyof typeof accentStyles];

            return (
              <article
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>

                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {stat.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <ClipboardList className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Recent Requests
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Your latest assigned maintenance requests.
                </p>
              </div>
            </div>

            <Link
              to="/maintenance"
              className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {data.recentRequests.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <Wrench className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                No assigned requests
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Assigned maintenance requests will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.recentRequests.map((request) => (
                <article
                  key={request.id}
                  className="p-5 transition hover:bg-slate-50/70 dark:hover:bg-slate-800/30 sm:p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <Wrench className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                          {request.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {request.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {request.priority}
                      </span>

                      <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                        {request.status}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <TrendingUp className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Operations Analysis
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Overview of your assigned maintenance workload and current
                    progress.
                  </p>
                </div>
              </div>

              <Link
                to="/maintenance"
                className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Manage Requests
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Total Workload
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {totalWorkload}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                    <Wrench className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-4 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  Total maintenance workload represented across your current
                  request statistics.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-900/40 dark:bg-emerald-500/5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                      Resolution Progress
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                      {resolvedPercentage}%
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950/60">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(resolvedPercentage, 100)}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-sm text-emerald-700/80 dark:text-emerald-400/80">
                  {data.statistics.resolvedRequests} resolved requests in your
                  current workload.
                </p>
              </div>

              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 dark:border-red-900/40 dark:bg-red-500/5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                      Urgent Requests
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-red-700 dark:text-red-400">
                      {data.statistics.urgentRequests}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-4 text-sm text-red-700/80 dark:text-red-400/80">
                  {urgentPercentage}% of the calculated workload is marked as
                  urgent.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Request Analysis
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Current status breakdown of your maintenance workload.
                  </p>
                </div>

                <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:inline-flex">
                  Current workload
                </span>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />

                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Assigned
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {data.statistics.assignedRequests}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(assignedPercentage, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />

                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        In Progress
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {data.statistics.inProgressRequests}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(inProgressPercentage, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Resolved
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {data.statistics.resolvedRequests}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(resolvedPercentage, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Wrench className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Assigned Work
                    </p>

                    <p className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
                      {data.statistics.assignedRequests}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                    <Clock3 className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      In Progress
                    </p>

                    <p className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
                      {data.statistics.inProgressRequests}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Completed
                    </p>

                    <p className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
                      {data.statistics.resolvedRequests}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default TechnicianDashboard;
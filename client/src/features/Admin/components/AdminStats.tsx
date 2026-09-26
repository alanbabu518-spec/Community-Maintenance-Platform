import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  LoaderCircle,
  Users,
  UserCog,
} from "lucide-react";

import { useAdminDashboard } from "../hooks/useAdminDashboard";

function AdminStats() {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div>
          <div className="mb-4 h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`top-${index}`}
                className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`bottom-${index}`}
                className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/40 dark:bg-red-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-red-800 dark:text-red-300">
              Unable to load admin statistics
            </h2>

            <p className="mt-1 text-sm text-red-700/80 dark:text-red-400/80">
              Please refresh the page and try again.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const primaryStats = [
    {
      label: "Total Residents",
      value: data.residents,
      icon: Users,
      description: "Registered residents",
      iconClass:
        "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
      accentClass: "bg-blue-500",
    },
    {
      label: "Total Staff",
      value: data.staff,
      icon: UserCog,
      description: "Platform staff members",
      iconClass:
        "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
      accentClass: "bg-violet-500",
    },
    {
      label: "Open Requests",
      value: data.openRequests,
      icon: ClipboardList,
      description: "Requests awaiting action",
      iconClass:
        "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
      accentClass: "bg-amber-500",
    },
    {
      label: "Active Communities",
      value: data.activeCommunities,
      icon: Building2,
      description: "Currently active communities",
      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
      accentClass: "bg-emerald-500",
    },
  ];

  const maintenanceStats = [
    {
      label: "Pending Requests",
      value: data.acknowledgedRequests + data.assignedRequests,
      icon: Clock3,
      description: "Acknowledged or assigned",
      iconClass:
        "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
      accentClass: "bg-amber-500",
    },
    {
      label: "In Progress",
      value: data.inProgressRequests,
      icon: LoaderCircle,
      description: "Currently being worked on",
      iconClass:
        "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
      accentClass: "bg-blue-500",
    },
    {
      label: "Resolved",
      value: data.resolvedRequests,
      icon: CheckCircle2,
      description: "Successfully resolved",
      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
      accentClass: "bg-emerald-500",
    },
    {
      label: "Urgent Issues",
      value: data.urgentRequests,
      icon: AlertTriangle,
      description: "Require immediate attention",
      iconClass:
        "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
      accentClass: "bg-red-500",
    },
  ];

  const renderStats = (
    stats:
      | typeof primaryStats
      | typeof maintenanceStats,
  ) => {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div
                className={`absolute left-0 right-0 top-0 h-0.5 ${stat.accentClass}`}
              />

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {stat.value.toLocaleString()}
                  </p>

                  <p className="mt-2 truncate text-xs text-slate-400 dark:text-slate-500">
                    {stat.description}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="space-y-7">
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Platform Overview
          </h2>

          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Users, staff, communities, and overall request activity.
          </p>
        </div>

        {renderStats(primaryStats)}
      </div>

      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Maintenance Operations
          </h2>

          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Current workload and maintenance request progress.
          </p>
        </div>

        {renderStats(maintenanceStats)}
      </div>
    </section>
  );
}

export default AdminStats;
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
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`top-${index}`}
              className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`bottom-${index}`}
              className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
        Unable to load admin statistics.
      </div>
    );
  }

  const primaryStats = [
    {
      label: "Total Residents",
      value: data.residents,
      icon: Users,
    },
    {
      label: "Total Staff",
      value: data.staff,
      icon: UserCog,
    },
    {
      label: "Open Requests",
      value: data.openRequests,
      icon: ClipboardList,
    },
    {
      label: "Active Communities",
      value: data.activeCommunities,
      icon: Building2,
    },
  ];

  const maintenanceStats = [
    {
      label: "Pending Requests",
      value: data.acknowledgedRequests + data.assignedRequests,
      icon: Clock3,
    },
    {
      label: "In Progress",
      value: data.inProgressRequests,
      icon: LoaderCircle,
    },
    {
      label: "Resolved",
      value: data.resolvedRequests,
      icon: CheckCircle2,
    },
    {
      label: "Urgent Issues",
      value: data.urgentRequests,
      icon: AlertTriangle,
    },
  ];

  const renderStats = (stats: typeof primaryStats, secondary = false) => (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </p>
              </div>

              <div
                className={`rounded-xl p-3 ${
                  secondary
                    ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="space-y-4">
      {renderStats(primaryStats)}

      {renderStats(maintenanceStats, true)}
    </section>
  );
}

export default AdminStats;

import {
  Activity,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  UserPlus,
  Users,
  Wrench,
} from "lucide-react";

import { useAdminActivity } from "../hooks/useAdminActivity";

function formatAction(action: string) {
  return action
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatTime(date: string) {
  return new Date(date).toLocaleString();
}

function formatRelativeTime(date: string) {
  const now = Date.now();
  const activityTime = new Date(date).getTime();

  const difference = Math.max(0, now - activityTime);

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Date(date).toLocaleDateString();
}

function getActivityStyle(action: string) {
  const normalizedAction = action.toLowerCase();

  if (
    normalizedAction.includes("create") ||
    normalizedAction.includes("add") ||
    normalizedAction.includes("register")
  ) {
    return {
      icon: UserPlus,
      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    };
  }

  if (
    normalizedAction.includes("delete") ||
    normalizedAction.includes("remove")
  ) {
    return {
      icon: FileText,
      iconClass:
        "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    };
  }

  if (
    normalizedAction.includes("resolve") ||
    normalizedAction.includes("complete") ||
    normalizedAction.includes("close")
  ) {
    return {
      icon: CheckCircle2,
      iconClass:
        "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    };
  }

  if (
    normalizedAction.includes("assign") ||
    normalizedAction.includes("maintenance") ||
    normalizedAction.includes("request")
  ) {
    return {
      icon: Wrench,
      iconClass:
        "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
    };
  }

  if (
    normalizedAction.includes("community") ||
    normalizedAction.includes("building")
  ) {
    return {
      icon: Building2,
      iconClass:
        "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    };
  }

  if (
    normalizedAction.includes("user") ||
    normalizedAction.includes("role")
  ) {
    return {
      icon: Users,
      iconClass:
        "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400",
    };
  }

  return {
    icon: Activity,
    iconClass:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  };
}

function RecentActivity() {
  const { data, isLoading, isError } = useAdminActivity();

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
          <div className="h-6 w-44 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="p-5 sm:p-6">
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-start gap-4"
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-800" />

                <div className="flex-1">
                  <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="mt-2 h-3 w-64 rounded bg-slate-100 dark:bg-slate-800" />

                  <div className="mt-2 h-3 w-24 rounded bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/40 dark:bg-red-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <Activity className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-red-800 dark:text-red-300">
              Unable to load recent activity
            </h2>

            <p className="mt-1 text-sm text-red-700/80 dark:text-red-400/80">
              Please refresh the page and try again.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const activities = data ?? [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Activity className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Recent actions performed across the platform.
            </p>
          </div>
        </div>

        {activities.length > 0 && (
          <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            {activities.length} recent{" "}
            {activities.length === 1 ? "activity" : "activities"}
          </div>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <Clock3 className="h-7 w-7" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
            No recent activity
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Platform activity will appear here as administrators and users
            perform actions.
          </p>
        </div>
      ) : (
        <div className="p-5 sm:p-6">
          <div className="max-h-140 overflow-y-auto pr-2">
            <div className="relative">
              <div className="absolute bottom-5 left-5 top-5 hidden w-px bg-slate-200 sm:block dark:bg-slate-800" />

              <div className="space-y-1">
                {activities.map((activity) => {
                  const style = getActivityStyle(activity.action);
                  const Icon = style.icon;

                  return (
                    <div
                      key={activity.id}
                      className="group relative flex gap-4 rounded-xl p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <div className="relative z-10 shrink-0">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.iconClass}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 py-0.5">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {formatAction(activity.action)}
                            </p>

                            <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {activity.actor.name}
                              </span>{" "}
                              updated{" "}
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {activity.entity.toLowerCase()}
                              </span>
                              {activity.entityId !== null && (
                                <span className="text-slate-400 dark:text-slate-500">
                                  {" "}
                                  #{activity.entityId}
                                </span>
                              )}
                            </p>
                          </div>

                          <div className="shrink-0">
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                              {formatRelativeTime(activity.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                          <Clock3 className="h-3.5 w-3.5" />

                          <span>{formatTime(activity.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default RecentActivity;
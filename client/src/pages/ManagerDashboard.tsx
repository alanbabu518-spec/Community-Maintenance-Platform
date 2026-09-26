import {
  Activity,
  CheckCircle2,
  ClipboardList,
  Clock,
  TrendingUp,
  UserCheck,
  Users,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Loading from "../components/ui/Loading";
import PageTransition from "../components/ui/PageTransition";
import ErrorPage from "../components/ui/ErrorPage";
import StatCard from "../components/ui/StatCard";
import MaintenanceCard from "../features/maintenance/components/MaintenanceCard";
import { ApiError } from "../services/apiClient";

import { useManagerDashboard } from "../features/dashboard/manager.queries";

function ManagerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useManagerDashboard();

  if (isLoading) {
    return <Loading type="dashboard" />;
  }

  if (isError || !data) {
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
          message="You don't have permission to view the manager dashboard."
          onBack={() => navigate("/dashboard")}
        />
      );
    }

    if (errorStatus === 500) {
      return (
        <ErrorPage
          errorCode="500"
          title="Server Error"
          message="The manager dashboard service encountered a problem. Please try again later."
          onRetry={() => refetch()}
          onBack={() => navigate("/manager/dashboard")}
        />
      );
    }

    return (
      <ErrorPage
        errorCode={errorStatus === 0 ? "NETWORK" : String(errorStatus)}
        title="Unable to Load Dashboard"
        message="We couldn't load the manager dashboard data. Please check your connection and try again."
        onRetry={() => refetch()}
        onBack={() => navigate("/manager/dashboard")}
      />
    );
  }

  const { statistics, recentRequests, technicians } = data;

  

  const totalRequests = statistics.totalRequests;

  const resolvedPercentage =
    totalRequests > 0
      ? Math.round((statistics.resolvedRequests / totalRequests) * 100)
      : 0;

  const openPercentage =
    totalRequests > 0
      ? Math.round((statistics.openRequests / totalRequests) * 100)
      : 0;

  const assignedPercentage =
    totalRequests > 0
      ? Math.round((statistics.assignedRequests / totalRequests) * 100)
      : 0;

  const inProgressPercentage =
    totalRequests > 0
      ? Math.round((statistics.inProgressRequests / totalRequests) * 100)
      : 0;

  const urgentPercentage =
    totalRequests > 0
      ? Math.round((statistics.urgentRequests / totalRequests) * 100)
      : 0;

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-slate-100 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 sm:p-8">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />
          <div className="absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <Activity className="h-4 w-4" />
                </div>

                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Community Operations
                </p>
              </div>

              <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Welcome back, {user?.name ?? "Manager"}
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Manage maintenance requests, monitor operational activity, and
                coordinate technicians across your community.
              </p>
            </div>

            <Link
              to="/maintenance"
              className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:w-auto"
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              View Maintenance
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Requests"
            value={statistics.totalRequests}
            description="Requests in your community"
            icon={ClipboardList}
            accent="slate"
          />

          <StatCard
            title="Open Requests"
            value={statistics.openRequests}
            description="Waiting for action"
            icon={Clock}
            accent="blue"
          />

          <StatCard
            title="Assigned Requests"
            value={statistics.assignedRequests}
            description="Assigned to technicians"
            icon={UserCheck}
            accent="purple"
          />

          <StatCard
            title="Resolved Requests"
            value={statistics.resolvedRequests}
            description="Successfully resolved"
            icon={CheckCircle2}
            accent="emerald"
          />
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
                    Maintenance workload and operational performance in your
                    community.
                  </p>
                </div>
              </div>

              <Link
                to="/maintenance"
                className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                View Requests
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
                      {totalRequests}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-4 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  Total maintenance requests currently recorded for your
                  community.
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
                  {statistics.resolvedRequests} of {totalRequests} requests
                  marked as resolved.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-900/40 dark:bg-amber-500/5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                      Urgent Issues
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-amber-700 dark:text-amber-400">
                      {statistics.urgentRequests}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-4 text-sm text-amber-700/80 dark:text-amber-400/80">
                  {urgentPercentage}% of the total request workload is marked
                  as urgent.
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
                    Current request activity across key operational states.
                  </p>
                </div>

                <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:inline-flex">
                  Live statistics
                </span>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />

                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Open
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {statistics.openRequests}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(openPercentage, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />

                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Assigned
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {statistics.assignedRequests}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all duration-500"
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
                      {statistics.inProgressRequests}
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
                      {statistics.resolvedRequests}
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
                    <Clock className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Awaiting Action
                    </p>

                    <p className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
                      {statistics.openRequests}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                    <UserCheck className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Assigned Work
                    </p>

                    <p className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
                      {statistics.assignedRequests}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Users className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Active Technicians
                    </p>

                    <p className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
                      {technicians.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <ClipboardList className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Recent Maintenance Requests
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Latest maintenance activity in your community.
                </p>
              </div>
            </div>

            <Link
              to="/maintenance"
              className="inline-flex w-fit items-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentRequests.length === 0 ? (
              <div className="px-5 py-16 text-center sm:px-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <ClipboardList className="h-5 w-5 text-slate-400" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  No maintenance requests
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  New requests from your community will appear here.
                </p>
              </div>
            ) : (
              recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 transition hover:bg-slate-50/70 dark:hover:bg-slate-800/30 sm:p-5"
                >
                  <MaintenanceCard request={request} />
                </div>
              ))
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Technicians
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Active technicians assigned to your community.
                </p>
              </div>
            </div>

            <Link
              to="/maintenance"
              className="inline-flex w-fit items-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              View Requests
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
            {technicians.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <Users className="h-5 w-5 text-slate-400" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  No active technicians
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Technicians assigned to your community will appear here.
                </p>
              </div>
            ) : (
              technicians.map((technician) => (
                <div
                  key={technician.id}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-950/30 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
                      {technician.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900 dark:text-white">
                        {technician.name}
                      </p>

                      <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
                        {technician.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Technician
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default ManagerDashboard;
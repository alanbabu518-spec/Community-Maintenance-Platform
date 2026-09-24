import { ClipboardList, Clock, UserCheck, CheckCircle2 } from "lucide-react";
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

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Welcome back
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {user?.name ?? "Manager"}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              Manage maintenance requests and technician assignments for your
              community.
            </p>
          </div>

          <Link
            to="/maintenance"
            className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:w-auto"
          >
            View Maintenance
          </Link>
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

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Recent Maintenance Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Latest maintenance activity in your community.
              </p>
            </div>

            <Link
              to="/maintenance"
              className="inline-flex w-fit items-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentRequests.length === 0 ? (
              <div className="px-5 py-14 text-center sm:px-6">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  No maintenance requests found.
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  New requests from your community will appear here.
                </p>
              </div>
            ) : (
              recentRequests.map((request) => (
                <div key={request.id} className="p-4 sm:p-5">
                  <MaintenanceCard request={request} />
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Technicians
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Active technicians assigned to your community.
              </p>
            </div>

            <Link
              to="/maintenance"
              className="inline-flex w-fit items-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              View Requests
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
            {technicians.length === 0 ? (
              <div className="col-span-full py-10 text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  No active technicians found.
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Technicians assigned to your community will appear here.
                </p>
              </div>
            ) : (
              technicians.map((technician) => (
                <div
                  key={technician.id}
                  className="rounded-xl border border-slate-200 p-5 transition hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:hover:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {technician.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900 dark:text-white">
                        {technician.name}
                      </p>

                      <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                        {technician.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 p-6 text-white sm:p-8 dark:from-slate-800 dark:to-slate-900">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-slate-300">
              Community Operations
            </p>

            <h2 className="mt-2 text-xl font-bold sm:text-2xl">
              Maintenance Overview
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Monitor maintenance activity and keep track of your community's
              operational workload.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-slate-400">Urgent</p>
                <p className="mt-1 text-2xl font-bold">
                  {statistics.urgentRequests}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">In Progress</p>
                <p className="mt-1 text-2xl font-bold">
                  {statistics.inProgressRequests}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Technicians</p>
                <p className="mt-1 text-2xl font-bold">
                  {technicians.length}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default ManagerDashboard;
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Clock, UserCheck, CheckCircle2 } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import MaintenanceCard from "../features/maintenance/components/MaintenanceCard";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/ui/Loading";
import PageTransition from "../components/ui/PageTransition";
import { useDashboardStats } from "../features/dashboard/hooks/useDashboardStats";
import { dashboardMaintenanceQuery } from "../features/dashboard/dashboard.queries";
import ErrorPage from "../components/ui/ErrorPage";
import { ApiError } from "../services/apiClient";

const roleCopy: Record<string, string> = {
  RESIDENT: "Report and track your maintenance requests.",
  TECHNICIAN: "View and manage your assigned maintenance requests.",
  MANAGER: "Manage maintenance requests and technician assignments.",
  ADMIN: "Manage the community platform and its users.",
};

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: dashboardStats,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErrorDetails,
    refetch: refetchStats,
  } = useDashboardStats();

  const {
    data: maintenanceData,
    isLoading: maintenanceLoading,
    isError: maintenanceError,
    error: maintenanceErrorDetails,
    refetch: refetchMaintenance,
  } = useQuery(dashboardMaintenanceQuery());

  const handleRetry = () => {
    if (statsError) {
      refetchStats();
    }

    if (maintenanceError) {
      refetchMaintenance();
    }
  };

  const requests = maintenanceData?.requests ?? [];

  if (statsLoading || maintenanceLoading) {
    return <Loading type="dashboard" />;
  }

  if (statsError || maintenanceError) {
    const error = statsError ? statsErrorDetails : maintenanceErrorDetails;

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
          message="You don't have permission to view the dashboard."
          onBack={() => navigate("/login")}
        />
      );
    }

    if (errorStatus === 500) {
      return (
        <ErrorPage
          errorCode="500"
          title="Server Error"
          message="The dashboard service encountered a problem. Please try again later."
          onRetry={handleRetry}
          onBack={() => navigate("/dashboard")}
        />
      );
    }

    return (
      <ErrorPage
        errorCode={errorStatus === 0 ? "NETWORK" : String(errorStatus)}
        title="Unable to Load Dashboard"
        message="We couldn't load the dashboard data. Please check your connection and try again."
        onRetry={handleRetry}
        onBack={() => navigate("/dashboard")}
      />
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Welcome back
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {user?.name ?? "User"}
            </h1>

            {user?.role && roleCopy[user.role] && (
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                {roleCopy[user.role]}
              </p>
            )}
          </div>

          {user?.role === "RESIDENT" && (
            <Link
              to="/maintenance/new"
              className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:w-auto"
            >
              Report an Issue
            </Link>
          )}
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Requests"
            value={dashboardStats?.totalRequests ?? 0}
            description="All maintenance requests"
            icon={ClipboardList}
            accent="slate"
          />

          <StatCard
            title="Open Requests"
            value={dashboardStats?.openRequests ?? 0}
            description="Waiting for action"
            icon={Clock}
            accent="blue"
          />

          <StatCard
            title="Assigned Requests"
            value={dashboardStats?.assignedRequests ?? 0}
            description="Assigned to technicians"
            icon={UserCheck}
            accent="purple"
          />

          <StatCard
            title="Resolved Requests"
            value={dashboardStats?.resolvedRequests ?? 0}
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
                Keep track of your latest maintenance activity.
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
            {requests.length === 0 ? (
              <div className="px-5 py-14 text-center sm:px-6">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  No maintenance requests found.
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Your maintenance requests will appear here.
                </p>
              </div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="p-4 sm:p-5">
                  <MaintenanceCard request={request} />
                </div>
              ))
            )}
          </div>
        </section>

        {user?.role === "RESIDENT" && (
          <section className="overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 p-6 text-white sm:p-8 dark:from-slate-800 dark:to-slate-900">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-slate-300">
                Need something fixed?
              </p>

              <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                Have a maintenance issue?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Report an issue in your community and track its progress from
                submission to resolution.
              </p>

              <Link
                to="/maintenance/new"
                className="mt-5 inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
              >
                Report an Issue
              </Link>
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
}

export default Dashboard;

import { useEffect, useMemo, useState } from "react";
import { getMaintenanceRequests } from "../services/maintenance.api";
import StatCard from "../components/ui/StatCard";
import MaintenanceCard from "../features/maintenance/components/MaintenanceCard";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { MaintenanceRequest } from "../features/maintenance/types";
import Loading from "../components/ui/Loading";
import PageTransition from "../components/ui/PageTransition";

function Dashboard() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadRequests() {
      try {
        const result = await getMaintenanceRequests();
        setRequests(result.requests);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  const statistics = useMemo(() => {
    let open = 0;
    let assigned = 0;
    let resolved = 0;

    for (const request of requests) {
      if (request.status === "OPEN") open++;
      if (request.status === "ASSIGNED") assigned++;
      if (request.status === "RESOLVED") resolved++;
    }

    return {
      total: requests.length,
      open,
      assigned,
      resolved,
    };
  }, [requests]);

  if (loading) {
    return <Loading type="dashboard" />;
  }

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Welcome back
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {user?.name ?? "User"}
            </h1>

            {user?.role === "RESIDENT" && (
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Report and track your maintenance requests.
              </p>
            )}

            {user?.role === "TECHNICIAN" && (
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                View and manage your assigned maintenance requests.
              </p>
            )}

            {user?.role === "MANAGER" && (
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Manage maintenance requests and technician assignments.
              </p>
            )}

            {user?.role === "ADMIN" && (
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Manage the community platform and its users.
              </p>
            )}
          </div>

          {user?.role === "RESIDENT" && (
            <Link
              to="/maintenance/new"
              className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:w-auto"
            >
              Report an Issue
            </Link>
          )}
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Requests"
            value={statistics.total}
            description="All maintenance requests"
          />

          <StatCard
            title="Open Requests"
            value={statistics.open}
            description="Waiting for action"
          />

          <StatCard
            title="Assigned Requests"
            value={statistics.assigned}
            description="Assigned to technicians"
          />

          <StatCard
            title="Resolved Requests"
            value={statistics.resolved}
            description="Successfully resolved"
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
              className="inline-flex w-fit items-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {requests.length === 0 ? (
              <div className="px-5 py-12 text-center sm:px-6">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  No maintenance requests found.
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Your maintenance requests will appear here.
                </p>
              </div>
            ) : (
              requests.slice(0, 5).map((request) => (
                <div key={request.id} className="p-4 sm:p-5">
                  <MaintenanceCard request={request} />
                </div>
              ))
            )}
          </div>
        </section>

        {user?.role === "RESIDENT" && (
          <section className="overflow-hidden rounded-2xl bg-slate-900 p-6 text-white sm:p-8 dark:bg-slate-800">
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
                className="mt-5 inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
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
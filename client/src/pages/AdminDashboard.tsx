import PageTransition from "../components/ui/PageTransition";
import { useAuth } from "../context/AuthContext";

import AdminStats from "../features/Admin/components/AdminStats";
import MaintenanceOverview from "../features/Admin/components/MaintenanceOverview";
import QuickActions from "../features/Admin/components/QuickActions";
import RecentActivity from "../features/Admin/components/RecentActivity";
import RecentRequests from "../features/Admin/components/RecentRequests";

function AdminDashboard() {
  const { user } = useAuth();

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Welcome back, {user?.name?.split(" ")[0] ?? "Admin"}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              Monitor your community platform and manage daily operations.
            </p>
          </div>

          <div className="hidden shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:block">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Role
            </p>

            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              Administrator
            </p>
          </div>
        </section>

        <AdminStats />

        <QuickActions />

        <MaintenanceOverview />

        <RecentRequests />

        <RecentActivity />
      </div>
    </PageTransition>
  );
}

export default AdminDashboard;
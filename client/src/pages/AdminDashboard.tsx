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
        <section>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Administration
          </p>

          <div className="mt-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {user?.name?.split(" ")[0] ?? "Admin"}
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Monitor your community platform and manage daily operations.
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

import { NavLink, Outlet } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 h-16 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white lg:hidden">
                  C
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400 lg:hidden">
                    CommunityCare
                  </p>

                  <h2 className="text-lg font-semibold text-slate-900">
                    Dashboard
                  </h2>
                </div>
              </div>

              <button
                type="button"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Profile
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-6">
            <Outlet />
          </main>

          <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white lg:hidden">
            <div className="grid grid-cols-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center justify-center px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "text-slate-900"
                      : "text-slate-500 hover:text-slate-900"
                  }`
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/maintenance"
                className={({ isActive }) =>
                  `flex items-center justify-center px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "text-slate-900"
                      : "text-slate-500 hover:text-slate-900"
                  }`
                }
              >
                Maintenance
              </NavLink>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
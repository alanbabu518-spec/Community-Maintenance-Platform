import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wrench,
  Menu,
  X,
  UserCog,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navigationSections = [
  {
    label: "Overview",
    items: [
      {
        name: "Dashboard",
        path: "/technician/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        name: "Maintenance",
        path: "/maintenance",
        icon: Wrench,
      },
    ],
  },
];

function TechnicianLayout() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const pageTitles: Record<string, string> = {
    "/technician/dashboard": "Technician Dashboard",
    "/maintenance": "Maintenance",
  };

  const pageTitle = pageTitles[location.pathname] ?? "Technician Dashboard";

  const navigation = (
    <nav className="flex-1 overflow-y-auto px-4 py-5">
      {navigationSections.map((section) => (
        <div key={section.label} className="mb-6">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {section.label}
          </p>

          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} strokeWidth={2} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-68 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:flex lg:flex-col">
          <div className="flex h-16 items-center border-b border-slate-200 px-5 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <UserCog size={20} />
              </div>

              <div>
                <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  CommunityCare
                </h1>

                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Technician
                </p>
              </div>
            </div>
          </div>

          {navigation}

          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
                {user?.name?.charAt(0).toUpperCase() || "T"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {user?.name || "Technician"}
                </p>

                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  Technician
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
            >
              <LogOut size={18} strokeWidth={2} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
                  aria-label="Open technician menu"
                >
                  <Menu size={20} />
                </button>

                <div>
                  <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {pageTitle}
                  </h1>

                  <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                    CommunityCare Technician
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {user?.name || "Technician"}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user?.email || ""}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
                  {user?.name?.charAt(0).toUpperCase() || "T"}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            aria-label="Close menu"
          />

          <aside className="relative flex h-full w-72 flex-col bg-white shadow-2xl dark:bg-slate-950">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  CommunityCare
                </p>

                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Technician
                </p>
              </div>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {navigation}

            <div className="border-t border-slate-200 p-4 dark:border-slate-800">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              >
                <LogOut size={18} strokeWidth={2} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default TechnicianLayout;

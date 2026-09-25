import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Bell,
  ChevronRight,
  Menu,
  X,
  Home,
  LayoutDashboard,
  Wrench,
  Users,
  Megaphone,
} from "lucide-react";

import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import NotificationDropdown from "../ui/NotificationDropdown";

function DashboardLayout() {
  const location = useLocation();
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    {
      name: "Home",
      path: "/",
      icon: Home,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Maintenance",
      path: "/maintenance",
      icon: Wrench,
    },
    {
      name: "Technicians",
      path: "/technicians",
      icon: Users,
    },
    {
      name: "Announcements",
      path: "/announcements",
      icon: Megaphone,
    },
  ];

  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/maintenance": "Maintenance",
    "/technicians": "Technicians",
    "/announcements": "Announcements",
  };

  const pageTitle = pageTitles[location.pathname] || "Dashboard";

  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
    : "User";

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                  aria-label="Open menu"
                >
                  <Menu size={20} />
                </button>

                <div className="flex min-w-0 items-center gap-2">
                  <span className="hidden text-sm text-slate-400 sm:block dark:text-slate-500">
                    CommunityCare
                  </span>

                  <ChevronRight
                    size={15}
                    className="hidden shrink-0 text-slate-300 sm:block dark:text-slate-700"
                  />

                  <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                    {pageTitle}
                  </h1>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div ref={notificationRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setShowNotifications((current) => !current)}
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    aria-label="Notifications"
                    aria-expanded={showNotifications}
                  >
                    <Bell size={19} />

                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <NotificationDropdown
                      onClose={() => setShowNotifications(false)}
                      onUnreadCountChange={setUnreadCount}
                    />
                  )}
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <div className="hidden min-w-0 border-l border-slate-200 pl-3 sm:block dark:border-slate-800">
                  <p className="max-w-32 truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {user?.name || "User"}
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {roleLabel}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <Users size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                    CommunityCare
                  </p>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                    Maintenance
                  </p>
                </div>
              </NavLink>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                aria-label="Close menu"
              >
                <X size={19} />
              </button>
            </div>

            <div className="border-b border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {user?.name || "User"}
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {roleLabel}
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                Navigation
              </p>

              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                          isActive
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                        }`
                      }
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </nav>

            <div className="border-t border-slate-200 p-4 dark:border-slate-800">
              <p className="text-center text-[10px] text-slate-400 dark:text-slate-600">
                © 2026 CommunityCare
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;

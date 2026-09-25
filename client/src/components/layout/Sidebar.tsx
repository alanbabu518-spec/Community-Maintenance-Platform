import { NavLink } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Wrench,
  Users,
  Megaphone,
  UsersRound,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

function Sidebar() {
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

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-5 dark:border-slate-800">
        <NavLink
          to="/"
          className="flex items-center gap-3 rounded-xl outline-none transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900">
            <UsersRound size={20} strokeWidth={2.2} />
          </div>

          <div className="leading-none">
            <h1 className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
              CommunityCare
            </h1>

            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              Maintenance
            </p>
          </div>
        </NavLink>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
          Navigation
        </p>

        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                          isActive
                            ? "bg-white/10 text-white dark:bg-slate-900/10 dark:text-slate-900"
                            : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:group-hover:bg-slate-800 dark:group-hover:text-white"
                        }`}
                      >
                        <Icon size={17} strokeWidth={2} />
                      </span>

                      <span>{item.name}</span>
                    </div>

                    {isActive && (
                      <ChevronRight
                        size={15}
                        strokeWidth={2}
                        className="opacity-70"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-300">
              <ShieldCheck size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                CommunityCare
              </p>

              <p className="mt-0.5 truncate text-[10px] text-slate-500 dark:text-slate-500">
                Community maintenance platform
              </p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] text-slate-400 dark:text-slate-600">
          © 2026 CommunityCare
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
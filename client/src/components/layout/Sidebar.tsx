import { NavLink } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Wrench,
  Users,
  Megaphone,
  UsersRound,
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
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <UsersRound size={21} />
          </div>

          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            CommunityCare
          </h1>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Menu
        </p>

        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
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
    </aside>
  );
}

export default Sidebar;
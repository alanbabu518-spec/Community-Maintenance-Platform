import { useCallback, useEffect, useState } from "react";
import { Bell, Moon, Sun } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getNotifications } from "../../services/notification.api";
import NotificationDropdown from "./NotificationDropdown";

function DashboardHeaderActions() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const updateUnreadCount = useCallback((count: number) => {
    setUnreadCount(count);
  }, []);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    let cancelled = false;

    getNotifications(1, 100)
      .then((result) => {
        if (!cancelled) {
          setUnreadCount(
            result.notifications.filter((notification) => !notification.isRead)
              .length,
          );
        }
      })
      .catch(() => {
        if (!cancelled) setUnreadCount(0);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const iconButtonClass =
    "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white";

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => setNotificationsOpen((open) => !open)}
          className={iconButtonClass}
          aria-label={
            unreadCount > 0
              ? `View notifications, ${unreadCount} unread`
              : "View notifications"
          }
          aria-expanded={notificationsOpen}
        >
          <Bell size={19} />
          {unreadCount > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
        {notificationsOpen && (
          <NotificationDropdown
            onClose={() => setNotificationsOpen(false)}
            onUnreadCountChange={updateUnreadCount}
          />
        )}
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        className={iconButtonClass}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
      </button>
    </div>
  );
}

export default DashboardHeaderActions;

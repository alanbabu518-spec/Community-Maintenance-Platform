import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  type Notification,
} from "../../services/notification.api";

interface NotificationDropdownProps {
  onClose: () => void;
  onUnreadCountChange: (count: number) => void;
}

function NotificationDropdown({
  onClose,
  onUnreadCountChange,
}: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const result = await getNotifications(1, 100);

        setNotifications(result.notifications);

        onUnreadCountChange(
          result.notifications.filter((notification) => !notification.isRead)
            .length,
        );
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, [onUnreadCountChange]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id);

      setNotifications((current) => {
        const updated = current.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                isRead: true,
                readAt: new Date().toISOString(),
              }
            : item,
        );

        onUnreadCountChange(updated.filter((item) => !item.isRead).length);

        return updated;
      });
    }
  };

  return (
    <div className="absolute right-0 top-[calc(100%+10px)] z-100 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Notifications
        </h3>

        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          Close
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center text-sm text-slate-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleNotificationClick(notification)}
              className={`w-full border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 ${
                notification.isRead
                  ? "bg-white dark:bg-slate-900"
                  : "bg-slate-50 dark:bg-slate-800/60"
              }`}
            >
              <div className="flex gap-3">
                {!notification.isRead && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                )}

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {notification.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-[11px] text-slate-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationDropdown;

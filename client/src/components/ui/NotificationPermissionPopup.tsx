import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import {
  requestNotificationPermission,
  subscribeToPush,
} from "../../services/push.ts";

const POPUP_DISMISSED_KEY =
  "communitycare_notification_prompt_seen";

function NotificationPermissionPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) return;

    if (Notification.permission !== "default") return;

    if (
      sessionStorage.getItem(POPUP_DISMISSED_KEY) === "true"
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setOpen(true);
    }, 800);

    return () => window.clearTimeout(timer);
  }, []);

  const enableNotifications = async () => {
    try {
      const granted = await requestNotificationPermission();

      if (!granted) return;

      await subscribeToPush();

      console.log("Push notifications enabled successfully");
    } catch (error) {
      console.error(
        "Failed to enable push notifications:",
        error
      );
    }
  };

  const handleAllow = () => {
    sessionStorage.setItem(
      POPUP_DISMISSED_KEY,
      "true"
    );

    setOpen(false);

    void enableNotifications();
  };

  const handleClose = () => {
    sessionStorage.setItem(
      POPUP_DISMISSED_KEY,
      "true"
    );

    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <Bell className="h-6 w-6" />
        </div>

        <div className="mt-5">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Enable Notifications
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Stay updated about maintenance requests,
            announcements, and important community updates.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Not Now
          </button>

          <button
            type="button"
            onClick={handleAllow}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Allow Notifications
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationPermissionPopup;
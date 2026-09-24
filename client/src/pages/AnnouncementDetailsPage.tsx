import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Info,
  Megaphone,
  PartyPopper,
  UserRound,
  Wrench,
} from "lucide-react";

import { getAnnouncement } from "../services/announcement.api";
import type { Announcement } from "../services/announcement.api";

const categoryIcon = {
  General: Info,
  Maintenance: Wrench,
  Event: PartyPopper,
  Emergency: AlertTriangle,
};

const categoryStrip = {
  General: "bg-stone-400 dark:bg-stone-500",
  Maintenance: "bg-teal-600 dark:bg-teal-500",
  Event: "bg-violet-600 dark:bg-violet-500",
  Emergency: "bg-orange-600 dark:bg-orange-500",
};

const categoryLabel = {
  General: "text-stone-600 dark:text-stone-400",
  Maintenance: "text-teal-800 dark:text-teal-400",
  Event: "text-violet-800 dark:text-violet-400",
  Emergency: "text-orange-800 dark:text-orange-400",
};

const priorityDot = {
  Low: "",
  Medium: "bg-amber-500",
  High: "bg-orange-600",
};

const priorityText = {
  Low: "",
  Medium: "text-amber-700 dark:text-amber-400",
  High: "text-orange-800 dark:text-orange-400",
};

function AnnouncementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    async function loadAnnouncement() {
      if (!id) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }

      const announcementId = Number(id);

      if (!Number.isInteger(announcementId) || announcementId <= 0) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setIsNotFound(false);

        const result = await getAnnouncement(announcementId);

        setAnnouncement(result);
      } catch {
        setAnnouncement(null);
        setIsNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadAnnouncement();
  }, [id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 h-5 w-40 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />

        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
          <div className="h-1.5 animate-pulse bg-stone-200 dark:bg-stone-800" />

          <div className="space-y-5 p-6 sm:p-8">
            <div className="h-5 w-32 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />

            <div className="h-9 w-3/4 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />

            <div className="flex gap-6">
              <div className="h-4 w-32 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-4 w-28 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            </div>
          </div>

          <div className="border-t border-stone-100 p-6 dark:border-stone-800 sm:p-8">
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-4 w-full animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isNotFound || !announcement) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-stone-300 text-stone-400 dark:border-stone-700 dark:text-stone-500">
            <Megaphone size={22} />
          </div>

          <h1 className="mt-4 font-serif text-xl font-medium text-stone-900 dark:text-white">
            Announcement not found
          </h1>

          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            This announcement doesn't exist or may have been removed.
          </p>

          <button
            type="button"
            onClick={() => navigate("/announcements")}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
          >
            <ArrowLeft size={17} />
            Back to announcements
          </button>
        </div>
      </div>
    );
  }

  const Icon = categoryIcon[announcement.category];
  const showPriority = announcement.priority !== "Low";

  const date = new Date(announcement.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={() => navigate("/announcements")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
      >
        <ArrowLeft size={17} />
        Back to announcements
      </button>

      <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
        <span
          className={`block h-1.5 w-full ${categoryStrip[announcement.category]}`}
          aria-hidden="true"
        />

        <div className="border-b border-stone-100 p-6 dark:border-stone-800 sm:p-8">
          <div
            className={`flex items-center gap-1.5 text-sm font-medium ${categoryLabel[announcement.category]}`}
          >
            <Icon size={16} />
            {announcement.category}

            {showPriority && (
              <span
                className={`ml-3 flex items-center gap-1.5 ${priorityText[announcement.priority]}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${priorityDot[announcement.priority]}`}
                />
                {announcement.priority} priority
              </span>
            )}
          </div>

          <h1 className="mt-3 font-serif text-2xl font-medium tracking-tight text-stone-900 dark:text-white sm:text-3xl">
            {announcement.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-2">
              <UserRound size={15} />
              <span>{announcement.author}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={15} />
              <span>{date}</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <p className="whitespace-pre-line text-base leading-8 text-stone-600 dark:text-stone-300">
            {announcement.message}
          </p>
        </div>

        <div className="border-t border-stone-100 bg-stone-50 px-6 py-5 dark:border-stone-800 dark:bg-stone-950/60 sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/announcements")}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-600 dark:hover:bg-stone-800"
          >
            <ArrowLeft size={17} />
            All announcements
          </button>
        </div>
      </article>
    </div>
  );
}

export default AnnouncementDetails;

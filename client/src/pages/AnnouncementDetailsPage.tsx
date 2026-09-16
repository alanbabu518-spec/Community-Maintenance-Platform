import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Megaphone,
  UserRound,
} from "lucide-react";
import type { Announcement } from "../features/announcements/components/AnnouncementCard";

const announcements: Announcement[] = [
  {
    id: "1",
    title: "Water Supply Maintenance",
    content:
      "Water supply will be temporarily unavailable tomorrow morning due to scheduled maintenance work.",
    category: "Maintenance",
    priority: "High",
    author: "Community Management",
    date: "Sep 16, 2026",
  },
  {
    id: "2",
    title: "Community Meeting This Weekend",
    content:
      "A community meeting will be held this Saturday to discuss upcoming maintenance and community activities.",
    category: "Event",
    priority: "Medium",
    author: "Association Committee",
    date: "Sep 15, 2026",
  },
  {
    id: "3",
    title: "Monthly Maintenance Payment Reminder",
    content:
      "Residents are requested to complete their monthly maintenance payment before the due date.",
    category: "General",
    priority: "Medium",
    author: "Community Management",
    date: "Sep 14, 2026",
  },
  {
    id: "4",
    title: "Parking Area Cleaning",
    content:
      "The parking area will undergo cleaning and maintenance work. Please keep the designated areas clear.",
    category: "Maintenance",
    priority: "Low",
    author: "Community Management",
    date: "Sep 12, 2026",
  },
  {
    id: "5",
    title: "Emergency Contact Information Updated",
    content:
      "Emergency contact information for the community has been updated. Residents can find the latest details in the community portal.",
    category: "Emergency",
    priority: "High",
    author: "Association Committee",
    date: "Sep 10, 2026",
  },
  {
    id: "6",
    title: "Community Festival Registration",
    content:
      "Registration is now open for the upcoming community festival. Residents can register their participation through the community office.",
    category: "Event",
    priority: "Low",
    author: "Community Committee",
    date: "Sep 8, 2026",
  },
];

function AnnouncementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const announcement = announcements.find(
    (item) => item.id === id,
  );

  if (!announcement) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Megaphone size={24} />
          </div>

          <h1 className="mt-4 text-xl font-semibold text-slate-900">
            Announcement Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The announcement you're looking for doesn't exist.
          </p>

          <button
            type="button"
            onClick={() => navigate("/announcements")}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={17} />
            Back to Announcements
          </button>
        </div>
      </div>
    );
  }

  const priorityStyles = {
    Low: "bg-slate-100 text-slate-600",
    Medium: "bg-amber-50 text-amber-700",
    High: "bg-red-50 text-red-600",
  };

  const categoryStyles = {
    General: "bg-blue-50 text-blue-700",
    Maintenance: "bg-orange-50 text-orange-700",
    Event: "bg-purple-50 text-purple-700",
    Emergency: "bg-red-50 text-red-700",
  };

  return (
    <div className="mx-auto max-w-4xl">
      <button
        type="button"
        onClick={() => navigate("/announcements")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
      >
        <ArrowLeft size={17} />
        Back to Announcements
      </button>

      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Megaphone size={21} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${categoryStyles[announcement.category]}`}
                  >
                    {announcement.category}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${priorityStyles[announcement.priority]}`}
                  >
                    {announcement.priority} Priority
                  </span>
                </div>

                <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {announcement.title}
                </h1>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 pt-5 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <UserRound size={16} />
              <span>{announcement.author}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={16} />
              <span>{announcement.date}</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="max-w-3xl">
            <p className="whitespace-pre-line text-base leading-8 text-slate-600">
              {announcement.content}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-6 py-5 sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/announcements")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            All Announcements
          </button>
        </div>
      </article>
    </div>
  );
}

export default AnnouncementDetails;
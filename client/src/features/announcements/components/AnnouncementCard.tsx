import {
  CalendarDays,
  Megaphone,
  UserRound,
} from "lucide-react";

export type Announcement = {
  id: string;
  title: string;
  content: string;
  category: "General" | "Maintenance" | "Event" | "Emergency";
  priority: "Low" | "Medium" | "High";
  author: string;
  date: string;
};

type AnnouncementCardProps = {
  announcement: Announcement;
  onClick?: () => void;
};

function AnnouncementCard({
  announcement,
  onClick,
}: AnnouncementCardProps) {
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
    <button
      type="button"
      onClick={onClick}
      className="group w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
          <Megaphone size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-base font-semibold text-slate-900 transition group-hover:text-slate-700">
            {announcement.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${categoryStyles[announcement.category]}`}
            >
              {announcement.category}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[announcement.priority]}`}
            >
              {announcement.priority} Priority
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
        {announcement.content}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <UserRound size={14} />
          <span>{announcement.author}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <CalendarDays size={14} />
          <span>{announcement.date}</span>
        </div>
      </div>
    </button>
  );
}

export default AnnouncementCard;
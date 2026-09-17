import {
  AlertTriangle,
  Info,
  PartyPopper,
  Wrench,
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

function AnnouncementCard({
  announcement,
  onClick,
}: AnnouncementCardProps) {
  const Icon = categoryIcon[announcement.category];
  const showPriority = announcement.priority !== "Low";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white text-left transition duration-300 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-lg hover:shadow-stone-900/5 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700 dark:hover:shadow-black/20 dark:focus:ring-stone-500 dark:focus:ring-offset-stone-950"
    >
      <span
        className={`h-1 w-full ${categoryStrip[announcement.category]}`}
        aria-hidden="true"
      />

      <div className="flex flex-1 flex-col p-5">
        <div
          className={`flex items-center gap-1.5 text-[13px] font-medium ${categoryLabel[announcement.category]}`}
        >
          <Icon size={15} />
          {announcement.category}
        </div>

        <h3 className="mt-2.5 font-serif text-lg font-medium leading-snug text-stone-900 transition group-hover:text-stone-600 dark:text-white dark:group-hover:text-stone-300">
          {announcement.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600 dark:text-stone-300">
          {announcement.content}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-xs text-stone-400 dark:border-stone-800 dark:text-stone-500">
          <span>
            {announcement.author} · {announcement.date}
          </span>

          {showPriority && (
            <span
              className={`flex items-center gap-1.5 font-medium ${priorityText[announcement.priority]}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${priorityDot[announcement.priority]}`}
              />
              {announcement.priority}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default AnnouncementCard;
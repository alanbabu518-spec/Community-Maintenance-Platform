import { ChevronDown, Search } from "lucide-react";

type AnnouncementFilterProps = {
  search: string;
  category: string;
  priority: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
};

function AnnouncementFilter({
  search,
  category,
  priority,
  onSearchChange,
  onCategoryChange,
  onPriorityChange,
}: AnnouncementFilterProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search announcements..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:bg-slate-950"
          />
        </div>

        <div className="relative">
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-500 dark:focus:bg-slate-950 sm:w-48"
          >
            <option value="All">All Categories</option>
            <option value="General">General</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Event">Event</option>
            <option value="Emergency">Emergency</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
        </div>

        <div className="relative">
          <select
            value={priority}
            onChange={(event) => onPriorityChange(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-slate-500 dark:focus:bg-slate-950 sm:w-44"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
        </div>
      </div>
    </section>
  );
}

export default AnnouncementFilter;
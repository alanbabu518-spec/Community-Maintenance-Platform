import { Search } from "lucide-react";

type AnnouncementFilterProps = {
  search: string;
  category: string;
  priority: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
};

const categories = ["All", "General", "Maintenance", "Event", "Emergency"];
const priorities = ["All", "Low", "Medium", "High"];

function PillGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs text-stone-400 dark:text-stone-500">
        {label}
      </span>

      {options.map((option) => {
        const active = option === value;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function AnnouncementFilter({
  search,
  category,
  priority,
  onSearchChange,
  onCategoryChange,
  onPriorityChange,
}: AnnouncementFilterProps) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="relative">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500"
        />

        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search announcements..."
          className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white dark:border-stone-700 dark:bg-stone-950 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-stone-500"
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-stone-100 pt-4 dark:border-stone-800">
        <PillGroup
          label="Category"
          options={categories}
          value={category}
          onChange={onCategoryChange}
        />

        <PillGroup
          label="Priority"
          options={priorities}
          value={priority}
          onChange={onPriorityChange}
        />
      </div>
    </section>
  );
}

export default AnnouncementFilter;
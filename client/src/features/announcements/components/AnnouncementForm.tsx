import type { FormEvent } from "react";
import { useState } from "react";
import {
  AlertTriangle,
  Info,
  PartyPopper,
  Send,
  Wrench,
} from "lucide-react";

export type AnnouncementFormData = {
  title: string;
  content: string;
  category: string;
  priority: string;
};

type AnnouncementFormProps = {
  onSubmit: (data: AnnouncementFormData) => void;
  onCancel: () => void;
};

const categories = [
  { value: "General", icon: Info },
  { value: "Maintenance", icon: Wrench },
  { value: "Event", icon: PartyPopper },
  { value: "Emergency", icon: AlertTriangle },
] as const;

const categoryActive = {
  General:
    "border-stone-400 bg-stone-100 text-stone-800 dark:border-stone-500 dark:bg-stone-800 dark:text-stone-100",
  Maintenance:
    "border-teal-600 bg-teal-50 text-teal-800 dark:border-teal-500 dark:bg-teal-950/40 dark:text-teal-400",
  Event:
    "border-violet-600 bg-violet-50 text-violet-800 dark:border-violet-500 dark:bg-violet-950/40 dark:text-violet-400",
  Emergency:
    "border-orange-600 bg-orange-50 text-orange-800 dark:border-orange-500 dark:bg-orange-950/40 dark:text-orange-400",
};

const priorities = ["Low", "Medium", "High"] as const;

const priorityActive = {
  Low: "border-stone-400 bg-stone-100 text-stone-800 dark:border-stone-500 dark:bg-stone-800 dark:text-stone-100",
  Medium:
    "border-amber-500 bg-amber-50 text-amber-800 dark:border-amber-500 dark:bg-amber-950/40 dark:text-amber-400",
  High:
    "border-orange-600 bg-orange-50 text-orange-800 dark:border-orange-500 dark:bg-orange-950/40 dark:text-orange-400",
};

const priorityDot = {
  Low: "bg-stone-400",
  Medium: "bg-amber-500",
  High: "bg-orange-600",
};

function AnnouncementForm({
  onSubmit,
  onCancel,
}: AnnouncementFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter an announcement title.");
      return;
    }

    if (!content.trim()) {
      setError("Please enter announcement content.");
      return;
    }

    setError("");

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
      priority,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
    >
      <div className="space-y-7 p-6 sm:p-8">
        <div>
          <label
            htmlFor="announcement-title"
            className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
          >
            Title
          </label>

          <input
            id="announcement-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Water supply maintenance"
            className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white dark:border-stone-700 dark:bg-stone-950 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-stone-500"
          />
        </div>

        <div>
          <label
            htmlFor="announcement-content"
            className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200"
          >
            Content
          </label>

          <textarea
            id="announcement-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write what residents need to know..."
            rows={7}
            className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:bg-white dark:border-stone-700 dark:bg-stone-950 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-stone-500"
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200">
            Category
          </span>

          <div className="flex flex-wrap gap-2">
            {categories.map(({ value, icon: Icon }) => {
              const active = category === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                    active
                      ? categoryActive[value]
                      : "border-stone-200 bg-white text-stone-500 hover:border-stone-300 hover:text-stone-700 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-400 dark:hover:text-stone-200"
                  }`}
                >
                  <Icon size={15} />
                  {value}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200">
            Priority
          </span>

          <div className="flex flex-wrap gap-2">
            {priorities.map((value) => {
              const active = priority === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPriority(value)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                    active
                      ? priorityActive[value]
                      : "border-stone-200 bg-white text-stone-500 hover:border-stone-300 hover:text-stone-700 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-400 dark:hover:text-stone-200"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${priorityDot[value]}`}
                  />
                  {value}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
            {error}
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-stone-100 bg-stone-50 px-6 py-5 dark:border-stone-800 dark:bg-stone-950/60 sm:flex-row sm:justify-end sm:px-8">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
        >
          <Send size={16} />
          Post announcement
        </button>
      </div>
    </form>
  );
}

export default AnnouncementForm;
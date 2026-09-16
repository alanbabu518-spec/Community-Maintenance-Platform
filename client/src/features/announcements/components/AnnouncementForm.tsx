import type{ FormEvent } from "react";
import { Send } from "lucide-react";
import { useState } from "react";

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
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="space-y-6 p-6 sm:p-8">
        <div>
          <label
            htmlFor="announcement-title"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Announcement Title
          </label>

          <input
            id="announcement-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter announcement title"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="announcement-content"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Announcement Content
          </label>

          <textarea
            id="announcement-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write your announcement..."
            rows={8}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="announcement-category"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Category
            </label>

            <select
              id="announcement-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
            >
              <option value="General">General</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Event">Event</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="announcement-priority"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Priority
            </label>

            <select
              id="announcement-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Send size={17} />
          Create Announcement
        </button>
      </div>
    </form>
  );
}

export default AnnouncementForm;
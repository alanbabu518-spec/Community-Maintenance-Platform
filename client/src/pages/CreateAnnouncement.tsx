import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Megaphone } from "lucide-react";
import AnnouncementForm, {
  type AnnouncementFormData,
} from "../features/announcements/components/AnnouncementForm";
import { createAnnouncement } from "../services/announcement.api";

function CreateAnnouncement() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (data: AnnouncementFormData) => {
    try {
      setError("");

      await createAnnouncement({
        title: data.title,
        message: data.content,
        category: data.category as
          | "General"
          | "Maintenance"
          | "Event"
          | "Emergency",
        priority: data.priority as "Low" | "Medium" | "High",
      });

      navigate("/announcements");
    } catch {
      setError(
        "Unable to post the announcement. Please try again.",
      );
    }
  };

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

      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-stone-900 text-stone-900 dark:border-white dark:text-white">
          <Megaphone size={20} />
        </div>

        <div>
          <h1 className="font-serif text-2xl font-medium tracking-tight text-stone-900 dark:text-white sm:text-3xl">
            New announcement
          </h1>

          <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400">
            This will be posted to the community feed right away.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          {error}
        </div>
      )}

      <AnnouncementForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/announcements")}
      />
    </div>
  );
}

export default CreateAnnouncement;
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Megaphone } from "lucide-react";
import AnnouncementForm, {
  type AnnouncementFormData,
} from "../features/announcements/components/AnnouncementForm";
import { useAuth } from "../context/AuthContext";
import { createAnnouncement } from "../services/announcement.api";

function CreateAnnouncement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleSubmit = async (data: AnnouncementFormData) => {
    if (!user?.communityId) {
      return;
    }

    await createAnnouncement({
      communityId: user.communityId,
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

      <AnnouncementForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/announcements")}
      />
    </div>
  );
}

export default CreateAnnouncement;

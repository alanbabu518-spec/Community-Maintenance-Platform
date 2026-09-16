import { useNavigate } from "react-router-dom";
import AnnouncementForm, {
  type AnnouncementFormData,
} from "../features/announcements/components/AnnouncementForm";
import {
  addAnnouncement,
  type StoredAnnouncement,
} from "../features/announcements/utils/announcementStorage";

function CreateAnnouncement() {
  const navigate = useNavigate();

  const handleSubmit = (data: AnnouncementFormData) => {
    const announcement: StoredAnnouncement = {
      id: crypto.randomUUID(),
      title: data.title,
      content: data.content,
      category: data.category as StoredAnnouncement["category"],
      priority: data.priority as StoredAnnouncement["priority"],
      author: "Community Manager",
      date: new Date().toISOString().split("T")[0],
    };

    addAnnouncement(announcement);

    navigate("/announcements");
  };

  return (
    <div>
      <AnnouncementForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/announcements")}
      />
    </div>
  );
}

export default CreateAnnouncement;

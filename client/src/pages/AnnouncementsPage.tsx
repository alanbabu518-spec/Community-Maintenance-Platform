import { useMemo, useState } from "react";
import {
  Bell,
  Megaphone,
  Plus,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnnouncementCard, {
  type Announcement,
} from "../features/announcements/components/AnnouncementCard";
import AnnouncementFilter from "../features/announcements/components/AnnouncementFilters"; 
import AnnouncementSkeleton from "../features/announcements/components/AnnouncementSkeleton";

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

function AnnouncementsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("All");

  const isLoading = false;

  const filteredAnnouncements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return announcements.filter((announcement) => {
      const matchesSearch =
        !query ||
        announcement.title.toLowerCase().includes(query) ||
        announcement.content.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" ||
        announcement.category === category;

      const matchesPriority =
        priority === "All" ||
        announcement.priority === priority;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPriority
      );
    });
  }, [search, category, priority]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setPriority("All");
  };

  return (
    <div>
      <section className="mb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Megaphone size={21} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Announcements
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Stay updated with the latest news, maintenance updates, events,
              and important information from your community.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/announcements/new")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={18} />
            Create Announcement
          </button>
        </div>
      </section>

      <section className="mb-7">
        <AnnouncementFilter
          search={search}
          category={category}
          priority={priority}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onPriorityChange={setPriority}
        />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Latest Announcements
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredAnnouncements.length}{" "}
              {filteredAnnouncements.length === 1
                ? "announcement"
                : "announcements"}
            </p>
          </div>

          <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
            <Bell size={16} />
            Community Updates
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
          </div>
        ) : filteredAnnouncements.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onClick={() =>
                  navigate(`/announcements/${announcement.id}`)
                }
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Search size={20} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-900">
              No announcements found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try changing your search or filter to find another announcement.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default AnnouncementsPage;
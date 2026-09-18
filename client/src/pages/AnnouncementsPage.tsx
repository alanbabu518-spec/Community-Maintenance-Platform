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
import { useAuth } from "../context/AuthContext";

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
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("All");

  const isLoading = false;

  const canCreateAnnouncement =
    user?.role === "ADMIN" || user?.role === "MANAGER";

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
      <section className="mb-8 border-b border-stone-200 pb-8 dark:border-stone-800">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-stone-900 text-stone-900 dark:border-white dark:text-white">
              <Megaphone size={20} />
            </div>

            <div>
              <h1 className="font-serif text-3xl font-medium tracking-tight text-stone-900 dark:text-white sm:text-4xl">
                Announcements
              </h1>

              <p className="mt-2 max-w-xl text-[15px] leading-6 text-stone-500 dark:text-stone-400">
                Everything posted for the community — maintenance notices,
                events, and updates from your association.
              </p>
            </div>
          </div>

          {canCreateAnnouncement && (
            <button
              type="button"
              onClick={() => navigate("/announcements/new")}
              className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
            >
              <Plus size={17} />
              Post an announcement
            </button>
          )}
        </div>
      </section>

      <section className="mb-8">
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
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            <span className="font-semibold text-stone-900 dark:text-white">
              {filteredAnnouncements.length}
            </span>{" "}
            {filteredAnnouncements.length === 1
              ? "announcement"
              : "announcements"}
          </p>

          <div className="hidden items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500 sm:flex">
            <Bell size={14} />
            Updated as they're posted
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
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center dark:border-stone-700 dark:bg-stone-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400">
              <Search size={20} />
            </div>

            <h3 className="mt-4 font-serif text-lg font-medium text-stone-900 dark:text-white">
              Nothing matches yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400">
              Try a different search term, or clear your filters to see
              everything again.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default AnnouncementsPage;
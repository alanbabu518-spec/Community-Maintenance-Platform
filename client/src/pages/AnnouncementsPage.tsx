import { useEffect, useMemo, useState } from "react";
import { Bell, Megaphone, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnnouncementCard, {
  type Announcement as CardAnnouncement,
} from "../features/announcements/components/AnnouncementCard";
import AnnouncementFilter from "../features/announcements/components/AnnouncementFilters";
import AnnouncementSkeleton from "../features/announcements/components/AnnouncementSkeleton";
import { useAuth } from "../context/AuthContext";
import {
  getAnnouncements,
  type Announcement as ApiAnnouncement,
} from "../services/announcement.api";

function AnnouncementsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [announcements, setAnnouncements] = useState<ApiAnnouncement[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const canCreateAnnouncement =
    user?.role === "ADMIN" || user?.role === "MANAGER";

  useEffect(() => {
    if (!user?.communityId) {
      setIsLoading(false);
      return;
    }

    async function loadAnnouncements() {
      try {
        setIsLoading(true);

        if (!user?.communityId) {
          return;
        }

        const result = await getAnnouncements(user.communityId);

        setAnnouncements(result.announcements);
      } catch {
        setAnnouncements([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadAnnouncements();
  }, [user]);

  useEffect(() => {
    const handleNewAnnouncement = (event: Event) => {
      const customEvent = event as CustomEvent<ApiAnnouncement>;
      const newAnnouncement = customEvent.detail;

      if (!newAnnouncement) {
        return;
      }

      setAnnouncements((currentAnnouncements) => {
        const alreadyExists = currentAnnouncements.some(
          (announcement) => announcement.id === newAnnouncement.id,
        );

        if (alreadyExists) {
          return currentAnnouncements;
        }

        return [newAnnouncement, ...currentAnnouncements];
      });
    };

    window.addEventListener(
      "announcement:new",
      handleNewAnnouncement,
    );

    return () => {
      window.removeEventListener(
        "announcement:new",
        handleNewAnnouncement,
      );
    };
  }, []);

  const filteredAnnouncements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return announcements.filter((announcement) => {
      const matchesSearch =
        !query ||
        announcement.title.toLowerCase().includes(query) ||
        announcement.message.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || announcement.category === category;

      const matchesPriority =
        priority === "All" || announcement.priority === priority;

      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [announcements, search, category, priority]);

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
            {filteredAnnouncements.map((announcement) => {
              const cardAnnouncement: CardAnnouncement = {
                id: String(announcement.id),
                title: announcement.title,
                content: announcement.message,
                category: announcement.category,
                priority: announcement.priority,
                author: announcement.author,
                date: new Date(
                  announcement.createdAt,
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
              };

              return (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={cardAnnouncement}
                  onClick={() =>
                    navigate(`/announcements/${announcement.id}`)
                  }
                />
              );
            })}
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
import { useMemo, useState } from "react";
import {
  Building2,
  Search,
  SlidersHorizontal,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

import PageTransition from "../components/ui/PageTransition";
import { useUsers } from "../features/users/hooks/useUsers";
import { useUpdateUserStatus } from "../features/users/hooks/useUpdateUserStatus";
import { useCommunities } from "../features/communities/hooks/useCommunities";

const AVATAR_PALETTE = [
  {
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    text: "text-indigo-700 dark:text-indigo-400",
  },
  {
    bg: "bg-teal-50 dark:bg-teal-500/10",
    text: "text-teal-700 dark:text-teal-400",
  },
  {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
  },
  {
    bg: "bg-rose-50 dark:bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-400",
  },
  {
    bg: "bg-violet-50 dark:bg-violet-500/10",
    text: "text-violet-700 dark:text-violet-400",
  },
];

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function paletteFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % AVATAR_PALETTE.length;
  }
  return AVATAR_PALETTE[Math.abs(hash)];
}

function Managers() {
  const [search, setSearch] = useState("");
  const [communityId, setCommunityId] = useState<number | undefined>();
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const filters = useMemo(
    () => ({
      page: 1,
      limit: 100,
      search: search || undefined,
      role: "MANAGER" as const,
      communityId,
      sortOrder: "desc" as const,
    }),
    [search, communityId],
  );

  const { data, isLoading, isError } = useUsers(filters);
  const { data: communities = [] } = useCommunities();
  const updateStatusMutation = useUpdateUserStatus();

  const managers =
    data?.users.filter((manager) => {
      if (status === "ACTIVE") return manager.isActive;
      if (status === "INACTIVE") return !manager.isActive;
      return true;
    }) ?? [];

  const activeCount = data?.users.filter((m) => m.isActive).length ?? 0;
  const hasActiveFilters =
    Boolean(search) || communityId !== undefined || status !== "ALL";

  const handleStatusChange = (userId: number, isActive: boolean) => {
    updateStatusMutation.mutate({ userId, isActive });
  };

  const clearFilters = () => {
    setSearch("");
    setCommunityId(undefined);
    setStatus("ALL");
  };

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-6xl">
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Managers
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {data ? (
                <>
                  {activeCount} of {data.users.length} managers currently active
                </>
              ) : (
                "Manage managers across your communities."
              )}
            </p>
          </div>
        </section>

        <div className="rounded-3xl bg-muted/50 p-3 sm:p-4">
          <div className="mb-4 flex flex-col gap-3 rounded-2xl bg-card p-3 shadow-md sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or email"
                className="h-10 w-full rounded-xl bg-muted/60 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:bg-muted"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={communityId ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  setCommunityId(value ? Number(value) : undefined);
                }}
                className="h-10 rounded-xl bg-muted/60 px-3 text-sm text-foreground outline-none"
              >
                <option value="">All communities</option>
                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </select>

              <div className="flex h-10 items-center gap-1 rounded-xl bg-muted/60 p-1">
                {(["ALL", "ACTIVE", "INACTIVE"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setStatus(option)}
                    className={`h-full rounded-lg px-3 text-sm font-medium transition ${
                      status === option
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {option === "ALL"
                      ? "All"
                      : option === "ACTIVE"
                        ? "Active"
                        : "Inactive"}
                  </button>
                ))}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl bg-card px-5 py-5 shadow-sm"
                >
                  <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-1/4 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="rounded-2xl bg-destructive/5 p-6 shadow-sm">
              <p className="text-sm font-medium text-destructive">
                Unable to load managers
              </p>
              <p className="mt-1 text-sm text-destructive/80">
                Check your connection and try refreshing the page.
              </p>
            </div>
          )}

          {!isLoading && !isError && managers.length === 0 && (
            <div className="rounded-2xl bg-card px-6 py-16 text-center shadow-sm">
              <SlidersHorizontal className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium text-foreground">
                No managers match these filters
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search term or clear your filters.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-xl bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted/70"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {!isLoading && !isError && managers.length > 0 && (
            <div className="space-y-3">
              {managers.map((manager) => {
                const community = communities.find(
                  (item) => item.id === manager.communityId,
                );
                const palette = paletteFor(manager.name);
                const pending =
                  updateStatusMutation.isPending &&
                  updateStatusMutation.variables?.userId === manager.id;

                return (
                  <article
                    key={manager.id}
                    className="rounded-2xl bg-card px-5 py-5 shadow-md transition hover:shadow-lg sm:px-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${palette.bg} ${palette.text}`}
                        >
                          {initialsOf(manager.name)}
                        </div>
                        <div className="min-w-0">
                          <h2 className="truncate text-base font-semibold text-foreground">
                            {manager.name}
                          </h2>
                          <p className="truncate text-sm text-muted-foreground">
                            {manager.email}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                              <Building2 className="h-3 w-3 text-muted-foreground" />
                              {community?.name ?? "No community assigned"}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                                manager.isActive
                                  ? "bg-foreground text-background"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  manager.isActive
                                    ? "bg-emerald-400"
                                    : "bg-muted-foreground"
                                }`}
                              />
                              {manager.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(manager.id, !manager.isActive)
                        }
                        disabled={pending}
                        className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted/70 disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
                      >
                        {manager.isActive ? (
                          <>
                            <UserX className="h-4 w-4" />
                            {pending ? "Deactivating…" : "Deactivate"}
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4" />
                            {pending ? "Activating…" : "Activate"}
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default Managers;

import { useMemo, useState } from "react";
import {
  Building2,
  Search,
  UserCheck,
  UserX,
} from "lucide-react";

import PageTransition from "../components/ui/PageTransition";
import { useUsers } from "../features/users/hooks/useUsers";
import { useUpdateUserStatus } from "../features/users/hooks/useUpdateUserStatus";
import { useCommunities } from "../features/communities/hooks/useCommunities";

function Residents() {
  const [search, setSearch] = useState("");
  const [communityId, setCommunityId] = useState<number | undefined>();
  const [status, setStatus] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const filters = useMemo(
    () => ({
      page: 1,
      limit: 100,
      search: search || undefined,
      role: "RESIDENT" as const,
      communityId,
      sortOrder: "desc" as const,
    }),
    [search, communityId],
  );

  const {
    data,
    isLoading,
    isError,
  } = useUsers(filters);

  const { data: communities = [] } = useCommunities();

  const updateStatusMutation = useUpdateUserStatus();

  const residents =
    data?.users.filter((resident) => {
      if (status === "ACTIVE") {
        return resident.isActive;
      }

      if (status === "INACTIVE") {
        return !resident.isActive;
      }

      return true;
    }) ?? [];

  const handleStatusChange = (
    userId: number,
    isActive: boolean,
  ) => {
    updateStatusMutation.mutate({
      userId,
      isActive,
    });
  };

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-7xl">
        <section className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">
            Residents
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage residents across your communities.
          </p>
        </section>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search residents..."
              className="h-12 w-full rounded-lg border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
            />
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <select
            value={communityId ?? ""}
            onChange={(event) => {
              const value = event.target.value;

              setCommunityId(
                value ? Number(value) : undefined,
              );
            }}
            className="h-10 min-w-180px rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground"
          >
            <option value="">All communities</option>

            {communities.map((community) => (
              <option key={community.id} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | "ALL"
                  | "ACTIVE"
                  | "INACTIVE",
              )
            }
            className="h-10 min-w-150px rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground"
          >
            <option value="ALL">All</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div className="mb-3">
          <p className="text-sm font-medium text-foreground">
            {residents.length}{" "}
            {residents.length === 1 ? "Resident" : "Residents"}
          </p>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-xl border border-border bg-card"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
            <p className="text-sm text-destructive">
              Unable to load residents.
            </p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          residents.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
              <p className="text-sm font-medium text-foreground">
                No residents found
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Try changing your search or filters.
              </p>
            </div>
          )}

        {!isLoading &&
          !isError &&
          residents.length > 0 && (
            <div className="space-y-4">
              {residents.map((resident) => {
                const community = communities.find(
                  (item) =>
                    item.id === resident.communityId,
                );

                return (
                  <article
                    key={resident.id}
                    className="rounded-xl border border-border bg-card px-5 py-5 shadow-sm transition hover:shadow-md sm:px-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-foreground">
                          {resident.name}
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                          {resident.email}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                          resident.isActive
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                            : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                      >
                        {resident.isActive
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />

                        <span className="text-xs font-medium text-foreground">
                          {community?.name ??
                            "No community assigned"}
                        </span>
                      </div>

                      <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        RESIDENT
                      </span>
                    </div>

                    <div className="mt-5 border-t border-border pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(
                            resident.id,
                            !resident.isActive,
                          )
                        }
                        disabled={
                          updateStatusMutation.isPending
                        }
                        className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {resident.isActive ? (
                          <>
                            <UserX className="h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4" />
                            Activate
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
    </PageTransition>
  );
}

export default Residents;
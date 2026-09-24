import { useMemo, useState } from "react";
import { Building2, Search, Users } from "lucide-react";

import PageTransition from "../components/ui/PageTransition";
import { useResidents } from "../features/users/hooks/useResidents";
import { useManagerCommunity } from "../features/communities/hooks/useManagerCommunity";

function ManagerResidents() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const { data: residents = [], isLoading, isError } = useResidents();
  const { data: community } = useManagerCommunity();

  const filteredResidents = useMemo(() => {
    return residents.filter((resident) => {
      const matchesSearch =
        !search ||
        resident.name.toLowerCase().includes(search.toLowerCase()) ||
        resident.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "ALL" ||
        (status === "ACTIVE" && resident.isActive) ||
        (status === "INACTIVE" && !resident.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [residents, search, status]);

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-6xl">
        <section className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Residents
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Residents in {community?.name ?? "your community"}
          </p>
        </section>

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
        </div>

        {!isLoading && !isError && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              {filteredResidents.length}{" "}
              {filteredResidents.length === 1 ? "Resident" : "Residents"}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-card shadow-sm"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-2xl bg-destructive/5 p-6 shadow-sm">
            <p className="text-sm font-medium text-destructive">
              Unable to load residents
            </p>

            <p className="mt-1 text-sm text-destructive/80">
              Check your connection and try again.
            </p>
          </div>
        )}

        {!isLoading && !isError && filteredResidents.length === 0 && (
          <div className="rounded-2xl bg-card px-6 py-16 text-center shadow-sm">
            <Users className="mx-auto h-6 w-6 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium text-foreground">
              No residents found
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search or status filter.
            </p>
          </div>
        )}

        {!isLoading && !isError && filteredResidents.length > 0 && (
          <div className="space-y-3">
            {filteredResidents.map((resident) => (
              <article
                key={resident.id}
                className="rounded-2xl bg-card px-5 py-5 shadow-md transition hover:shadow-lg sm:px-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-foreground">
                      {resident.name}
                    </h2>

                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {resident.email}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        {community?.name ?? "Your community"}
                      </span>

                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        RESIDENT
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      resident.isActive
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        resident.isActive
                          ? "bg-emerald-400"
                          : "bg-muted-foreground"
                      }`}
                    />

                    {resident.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export default ManagerResidents;
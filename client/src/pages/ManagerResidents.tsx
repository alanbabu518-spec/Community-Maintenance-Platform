import { useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Search,
  UserRound,
  UserX,
  Users,
} from "lucide-react";

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

  const activeCount = residents.filter(
    (resident) => resident.isActive,
  ).length;

  const inactiveCount = residents.filter(
    (resident) => !resident.isActive,
  ).length;

  const getInitials = (name: string) => {
    return (
      name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "R"
    );
  };

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Users className="h-3.5 w-3.5" />
              Resident Management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Residents
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              View and manage residents belonging to{" "}
              {community?.name ?? "your community"}.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {residents.length}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total residents
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Residents
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {residents.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Active
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                  {activeCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 shadow-sm dark:border-red-900/40 dark:bg-red-950/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  Inactive
                </p>

                <p className="mt-2 text-2xl font-bold text-red-800 dark:text-red-300">
                  {inactiveCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                <UserX className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Find Residents
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Search residents and filter accounts by status.
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or email..."
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />
            </div>

            <div className="flex h-11 items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              {(["ALL", "ACTIVE", "INACTIVE"] as const).map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setStatus(option)}
                    className={`h-full rounded-md px-4 text-sm font-medium transition ${
                      status === option
                        ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {option === "ALL"
                      ? "All"
                      : option === "ACTIVE"
                        ? "Active"
                        : "Inactive"}
                  </button>
                ),
              )}
            </div>
          </div>
        </section>

        {!isLoading && !isError && (
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Resident Accounts
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Showing {filteredResidents.length}{" "}
                {filteredResidents.length === 1
                  ? "resident"
                  : "residents"}
              </p>
            </div>

            <span className="hidden items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 sm:inline-flex dark:bg-slate-800 dark:text-slate-300">
              <UserRound className="h-3.5 w-3.5" />
              Community residents
            </span>
          </div>
        )}

        {isLoading && (
          <div className="grid gap-4 lg:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 dark:border-red-900/40 dark:bg-red-950/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <UserX className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
                  Unable to load residents
                </h3>

                <p className="mt-1 text-sm text-red-700/80 dark:text-red-400/80">
                  Check your connection and try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {!isLoading &&
          !isError &&
          filteredResidents.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Users className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-slate-900 dark:text-white">
                No residents found
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Try changing your search term or status filter.
              </p>
            </div>
          )}

        {!isLoading &&
          !isError &&
          filteredResidents.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredResidents.map((resident) => (
                <article
                  key={resident.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {getInitials(resident.name)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                          {resident.name}
                        </h3>

                        <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                          {resident.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                        resident.isActive
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-900/40"
                          : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900/40"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          resident.isActive
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />

                      {resident.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Community
                      </p>

                      <div className="mt-1.5 flex min-w-0 items-center gap-2">
                        <Building2 className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />

                        <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                          {community?.name ?? "Your community"}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Role
                      </p>

                      <p className="mt-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                        Resident
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Community account
                    </span>

                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {resident.isActive ? "Access enabled" : "Access disabled"}
                    </div>
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
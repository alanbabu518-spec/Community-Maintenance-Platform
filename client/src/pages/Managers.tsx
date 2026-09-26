import { useMemo, useState } from "react";
import {
  Activity,
  Building2,
  CheckCircle2,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
  Users,
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

  return (first + last).toUpperCase() || "M";
}

function paletteFor(name: string) {
  let hash = 0;

  for (let i = 0; i < name.length; i += 1) {
    hash =
      (hash * 31 + name.charCodeAt(i)) %
      AVATAR_PALETTE.length;
  }

  return AVATAR_PALETTE[Math.abs(hash)];
}

function Managers() {
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

  const totalCount = data?.users.length ?? 0;

  const activeCount =
    data?.users.filter((manager) => manager.isActive).length ?? 0;

  const inactiveCount = totalCount - activeCount;

  const hasActiveFilters =
    Boolean(search) ||
    communityId !== undefined ||
    status !== "ALL";

  const handleStatusChange = (
    userId: number,
    isActive: boolean,
  ) => {
    updateStatusMutation.mutate({
      userId,
      isActive,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setCommunityId(undefined);
    setStatus("ALL");
  };

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Users className="h-4 w-4" />
              Community Management
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Managers
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              Manage community managers, their assignments, and account
              access across the platform.
            </p>
          </div>

          <div className="hidden shrink-0 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:block">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Total Managers
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {totalCount.toLocaleString()}
            </p>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <Activity className="h-3.5 w-3.5" />
              {activeCount} currently active
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Managers
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {totalCount.toLocaleString()}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-5 shadow-sm dark:border-violet-900/40 dark:bg-violet-950/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-violet-700 dark:text-violet-400">
                  Active
                </p>

                <p className="mt-2 text-2xl font-bold text-violet-800 dark:text-violet-300">
                  {activeCount.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-violet-600/80 dark:text-violet-400/70">
                  Active manager accounts
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">
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
                  {inactiveCount.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-red-600/80 dark:text-red-400/70">
                  Account access disabled
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                <UserX className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <SlidersHorizontal className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Find Managers
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Search and filter manager accounts.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_220px_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or email..."
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />
            </div>

            <select
              value={communityId ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                setCommunityId(
                  value ? Number(value) : undefined,
                );
              }}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            >
              <option value="">All communities</option>

              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.name}
                </option>
              ))}
            </select>

            <div className="flex h-11 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-950">
              {(["ALL", "ACTIVE", "INACTIVE"] as const).map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setStatus(option)}
                    className={`h-full rounded-md px-3 text-xs font-semibold transition ${
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

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            ) : (
              <div className="hidden lg:block" />
            )}
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Manager Accounts
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Showing {managers.length}{" "}
              {managers.length === 1 ? "manager" : "managers"}
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Manager accounts
          </div>
        </div>

        {isLoading && (
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
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
                  Unable to load managers
                </h3>

                <p className="mt-1 text-sm text-red-700/80 dark:text-red-400/80">
                  Check your connection and refresh the page to try
                  again.
                </p>
              </div>
            </div>
          </div>
        )}

        {!isLoading &&
          !isError &&
          managers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Users className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-slate-900 dark:text-white">
                No managers found
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
                No manager accounts match the current search and
                filter settings.
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

        {!isLoading &&
          !isError &&
          managers.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {managers.map((manager) => {
                const community = communities.find(
                  (item) => item.id === manager.communityId,
                );

                const palette = paletteFor(manager.name);

                const pending =
                  updateStatusMutation.isPending &&
                  updateStatusMutation.variables?.userId ===
                    manager.id;

                return (
                  <article
                    key={manager.id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${palette.bg} ${palette.text}`}
                        >
                          {initialsOf(manager.name)}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                            {manager.name}
                          </h3>

                          <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                            {manager.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                          manager.isActive
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-900/40"
                            : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900/40"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            manager.isActive
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        />

                        {manager.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          Community
                        </p>

                        <div className="mt-2 flex min-w-0 items-center gap-2">
                          <Building2 className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />

                          <span className="truncate text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {community?.name ??
                              "No community assigned"}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          Role
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-violet-500" />

                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Manager
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Account access
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                          {manager.isActive
                            ? "Manager can access the platform."
                            : "Manager access is currently disabled."}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(
                            manager.id,
                            !manager.isActive,
                          )
                        }
                        disabled={pending}
                        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          manager.isActive
                            ? "border border-red-200 bg-white text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/20"
                            : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                        }`}
                      >
                        {manager.isActive ? (
                          <>
                            <UserX className="h-4 w-4" />
                            {pending
                              ? "Deactivating..."
                              : "Deactivate"}
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4" />
                            {pending
                              ? "Activating..."
                              : "Activate"}
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

export default Managers;

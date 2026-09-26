import {
  Building2,
  CheckCircle2,
  Mail,
  UserRound,
  UserX,
  Users,
} from "lucide-react";

import PageTransition from "../components/ui/PageTransition";
import { useTechnicians } from "../features/users/hooks/useTechnicians";

function ManagerTechnicians() {
  const {
    data: technicians = [],
    isLoading,
    isError,
  } = useTechnicians();

  const activeCount = technicians.filter(
    (technician) => technician.isActive,
  ).length;

  const inactiveCount = technicians.filter(
    (technician) => !technician.isActive,
  ).length;

  const getInitials = (name: string) => {
    return (
      name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "T"
    );
  };

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Users className="h-3.5 w-3.5" />
              Team Management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Technicians
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              View technicians assigned to your community and monitor their
              account status.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {technicians.length}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total technicians
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {technicians.length}
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

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Technician Accounts
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Technicians currently associated with your community.
              </p>
            </div>

            {!isLoading && !isError && (
              <span className="hidden items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 sm:inline-flex dark:bg-slate-800 dark:text-slate-300">
                <UserRound className="h-3.5 w-3.5" />
                {technicians.length}{" "}
                {technicians.length === 1
                  ? "technician"
                  : "technicians"}
              </span>
            )}
          </div>

          {isLoading && (
            <div className="grid gap-4 lg:grid-cols-2">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
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
                    Unable to load technicians
                  </h3>

                  <p className="mt-1 text-sm text-red-700/80 dark:text-red-400/80">
                    Check your connection and try again.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !isError && technicians.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Users className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-slate-900 dark:text-white">
                No technicians found
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Technicians assigned to your community will appear here.
              </p>
            </div>
          )}

          {!isLoading && !isError && technicians.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {technicians.map((technician) => (
                <article
                  key={technician.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {getInitials(technician.name)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                          {technician.name}
                        </h3>

                        <div className="mt-1 flex min-w-0 items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />

                          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                            {technician.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                        technician.isActive
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-900/40"
                          : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900/40"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          technician.isActive
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />

                      {technician.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Role
                      </p>

                      <p className="mt-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                        Technician
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Status
                      </p>

                      <div className="mt-1.5 flex items-center gap-1.5">
                        {technician.isActive ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <UserX className="h-4 w-4 text-red-500" />
                        )}

                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {technician.isActive ? "Available" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                      <Building2 className="h-3.5 w-3.5" />
                      Community technician
                    </div>

                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Account #{technician.id}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}

export default ManagerTechnicians;
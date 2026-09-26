import {
  Building2,
  Home,
  MapPin,
  Hash,
  Layers3,
} from "lucide-react";

import PageTransition from "../components/ui/PageTransition";
import Loading from "../components/ui/Loading";
import ErrorPage from "../components/ui/ErrorPage";

import {
  useManagerBuildings,
  useManagerCommunity,
  useManagerUnits,
} from "../features/communities/hooks/useManagerCommunity";

interface BuildingCardProps {
  building: {
    id: number;
    name: string;
    communityId: number;
  };
}

function BuildingCard({ building }: BuildingCardProps) {
  const {
    data: units = [],
    isLoading,
    isError,
  } = useManagerUnits(building.id);

  return (
    <div className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-slate-700 dark:hover:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <Building2 className="h-5 w-5" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          <Hash className="h-3 w-3" />
          {building.id}
        </span>
      </div>

      <div className="mt-5">
        <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
          {building.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Community building
        </p>
      </div>

      <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Home className="h-3.5 w-3.5" />
            </div>

            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Units
            </span>
          </div>

          {!isLoading && !isError && (
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              {units.length}
            </span>
          )}
        </div>

        {isLoading && (
          <div className="mt-4 h-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        )}

        {isError && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
            Unable to load units.
          </p>
        )}

        {!isLoading && !isError && units.length === 0 && (
          <div className="mt-3 rounded-lg border border-dashed border-slate-200 px-3 py-3 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No units found.
            </p>
          </div>
        )}

        {!isLoading && !isError && units.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {units.map((unit) => (
              <span
                key={unit.id}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                {unit.unitNumber}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ManagerCommunity() {
  const {
    data: community,
    isLoading,
    isError,
  } = useManagerCommunity();

  const {
    data: buildings = [],
    isLoading: buildingsLoading,
    isError: buildingsError,
  } = useManagerBuildings(community?.id);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !community) {
    return (
      <ErrorPage
        title="Unable to load community"
        message="We couldn't load your assigned community. Please try again."
      />
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-slate-100 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/70 sm:p-8">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900">
              <Building2 className="h-7 w-7" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                Community Management
              </p>

              <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {community.name}
              </h1>

              <div className="mt-3 flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />

                <span className="leading-6">{community.address}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Community Details
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Information about your assigned community.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500 shadow-xs dark:bg-slate-900 dark:text-slate-400">
                  <Building2 className="h-4 w-4" />
                </div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Community Name
                </p>
              </div>

              <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                {community.name}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500 shadow-xs dark:bg-slate-900 dark:text-slate-400">
                  <Hash className="h-4 w-4" />
                </div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Community ID
                </p>
              </div>

              <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                #{community.id}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40 sm:col-span-2">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <MapPin className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Address
                  </p>

                  <p className="mt-2 text-sm font-medium leading-6 text-slate-900 dark:text-white">
                    {community.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <Layers3 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Buildings
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Buildings belonging to your community.
                </p>
              </div>
            </div>

            {!buildingsLoading && !buildingsError && (
              <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {buildings.length}{" "}
                {buildings.length === 1 ? "building" : "buildings"}
              </span>
            )}
          </div>

          {buildingsLoading && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40"
                />
              ))}
            </div>
          )}

          {buildingsError && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
              <p className="font-semibold">Unable to load buildings</p>
              <p className="mt-1 text-red-500/80 dark:text-red-400/80">
                Please try again later.
              </p>
            </div>
          )}

          {!buildingsLoading &&
            !buildingsError &&
            buildings.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-950/40">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs dark:bg-slate-900">
                  <Building2 className="h-6 w-6 text-slate-400" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                  No buildings found
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
                  No buildings have been added to this community yet.
                </p>
              </div>
            )}

          {!buildingsLoading &&
            !buildingsError &&
            buildings.length > 0 && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {buildings.map((building) => (
                  <BuildingCard
                    key={building.id}
                    building={building}
                  />
                ))}
              </div>
            )}
        </section>
      </div>
    </PageTransition>
  );
}

export default ManagerCommunity;
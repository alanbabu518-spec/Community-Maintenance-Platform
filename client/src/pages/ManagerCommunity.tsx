import { Building2, MapPin, Home } from "lucide-react";
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
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-primary/30 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 className="h-5 w-5" />
        </div>

        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          #{building.id}
        </span>
      </div>

      <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
        {building.name}
      </h3>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Community building
      </p>

      <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-primary" />

            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Units
            </span>
          </div>

          {!isLoading && !isError && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {units.length}
            </span>
          )}
        </div>

        {isLoading && (
          <div className="mt-3 h-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        )}

        {isError && (
          <p className="mt-3 text-xs text-red-500 dark:text-red-400">
            Unable to load units.
          </p>
        )}

        {!isLoading && !isError && units.length === 0 && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            No units found.
          </p>
        )}

        {!isLoading && !isError && units.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {units.map((unit) => (
              <span
                key={unit.id}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
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
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Building2 className="h-7 w-7" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-primary">
                Community Management
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {community.name}
              </h1>

              <div className="mt-3 flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                <span className="leading-6">
                  {community.address}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Community Details
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Information about your assigned community.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Community Name
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {community.name}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Community ID
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                #{community.id}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40 sm:col-span-2">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <MapPin className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
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

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Buildings
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Buildings belonging to your community.
              </p>
            </div>

            {!buildingsLoading && !buildingsError && (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
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
                  className="h-40 animate-pulse rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40"
                />
              ))}
            </div>
          )}

          {buildingsError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
              Unable to load buildings. Please try again.
            </div>
          )}

          {!buildingsLoading &&
            !buildingsError &&
            buildings.length === 0 && (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950/40">
                <Building2 className="mx-auto h-8 w-8 text-slate-400" />

                <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                  No buildings found
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
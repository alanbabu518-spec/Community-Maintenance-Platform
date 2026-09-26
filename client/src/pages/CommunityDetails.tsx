import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Home,
  Plus,
  ArrowUpRight,
} from "lucide-react";

import PageTransition from "../components/ui/PageTransition";
import { useCommunities } from "../features/communities/hooks/useCommunities";
import { useBuildings } from "../features/communities/hooks/useBuildings";
import { useCreateBuilding } from "../features/communities/hooks/useCreateBuilding";

function CommunityDetails() {
  const { communityId } = useParams<{ communityId: string }>();
  const id = Number(communityId);

  const { data: communities = [], isLoading: communitiesLoading } =
    useCommunities();

  const {
    data: buildings = [],
    isLoading: buildingsLoading,
    isError: buildingsError,
  } = useBuildings(id);

  const createBuildingMutation = useCreateBuilding();

  const [buildingName, setBuildingName] = useState("");

  const community = communities.find((item) => item.id === id);

  const handleCreateBuilding = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      await createBuildingMutation.mutateAsync({
        name: buildingName,
        communityId: id,
      });

      setBuildingName("");
    } catch {
      return;
    }
  };

  if (communitiesLoading) {
    return (
      <PageTransition>
        <div className="mx-auto w-full max-w-7xl space-y-6">
          <div className="h-5 w-40 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />

          <div className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />

          <div className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />
        </div>
      </PageTransition>
    );
  }

  if (!community) {
    return (
      <PageTransition>
        <div className="mx-auto w-full max-w-7xl">
          <Link
            to="/communities"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Communities
          </Link>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Building2 className="h-6 w-6" />
            </div>

            <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              Community not found
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              The requested community could not be found.
            </p>

            <Link
              to="/communities"
              className="mt-5 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              View Communities
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <Link
          to="/communities"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Communities
        </Link>

        <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Building2 className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Community
              </p>

              <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {community.name}
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {community.address}
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Community ID
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              #{community.id}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Plus className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Add Building
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add a building to {community.name}.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCreateBuilding}
            className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:p-6"
          >
            <div className="flex-1">
              <label
                htmlFor="building-name"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Building name
              </label>

              <input
                id="building-name"
                type="text"
                value={buildingName}
                onChange={(event) => setBuildingName(event.target.value)}
                placeholder="e.g. Building A"
                required
                minLength={1}
                maxLength={100}
                disabled={createBuildingMutation.isPending}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={createBuildingMutation.isPending}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <Plus className="h-4 w-4" />

              {createBuildingMutation.isPending
                ? "Adding..."
                : "Add Building"}
            </button>
          </form>

          {createBuildingMutation.isError && (
            <div className="mx-5 mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 sm:mx-6 sm:mb-6">
              Failed to add building. Please try again.
            </div>
          )}
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Buildings
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {buildings.length}{" "}
                {buildings.length === 1 ? "building" : "buildings"} in this
                community
              </p>
            </div>

            {!buildingsLoading && buildings.length > 0 && (
              <span className="hidden rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 sm:inline-flex dark:bg-slate-800 dark:text-slate-400">
                {buildings.length}{" "}
                {buildings.length === 1 ? "building" : "buildings"}
              </span>
            )}
          </div>

          {buildingsLoading && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                />
              ))}
            </div>
          )}

          {buildingsError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <Building2 className="h-5 w-5" />
              </div>

              <p className="mt-4 text-sm font-semibold text-red-700 dark:text-red-400">
                Unable to load buildings
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Please refresh the page and try again.
              </p>
            </div>
          )}

          {!buildingsLoading &&
            !buildingsError &&
            buildings.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Building2 className="h-7 w-7" />
                </div>

                <h3 className="mt-5 font-semibold text-slate-900 dark:text-white">
                  No buildings yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Buildings for this community have not been added yet. Use
                  the form above to add the first building.
                </p>
              </div>
            )}

          {!buildingsLoading &&
            !buildingsError &&
            buildings.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {buildings.map((building) => (
                  <Link
                    key={building.id}
                    to={`/buildings/${building.id}`}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:focus:ring-slate-700"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-white dark:group-hover:text-slate-900">
                        <Building2 className="h-5 w-5" />
                      </div>

                      <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                        #{building.id}
                      </span>
                    </div>

                    <div className="mt-5">
                      <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                        {building.name}
                      </h3>

                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Home className="h-4 w-4" />
                        <span>View units</span>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                        Building
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 transition-all group-hover:gap-2.5 dark:text-white">
                        View details
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
        </section>
      </div>
    </PageTransition>
  );
}

export default CommunityDetails;
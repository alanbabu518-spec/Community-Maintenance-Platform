import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Home,
  Layers3,
  Plus,
} from "lucide-react";

import PageTransition from "../components/ui/PageTransition";
import { useBuilding } from "../features/communities/hooks/useBuilding";
import { useUnits } from "../features/communities/hooks/useUnits";
import { useCreateUnit } from "../features/communities/hooks/useCreateUnit";

function BuildingDetails() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const id = Number(buildingId);

  const {
    data: building,
    isLoading: buildingLoading,
    isError: buildingError,
  } = useBuilding(id);

  const {
    data: units = [],
    isLoading: unitsLoading,
    isError: unitsError,
  } = useUnits(id);

  const createUnitMutation = useCreateUnit();

  const [unitNumber, setUnitNumber] = useState("");

  const handleCreateUnit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!unitNumber.trim()) return;

    try {
      await createUnitMutation.mutateAsync({
        unitNumber: unitNumber.trim(),
        buildingId: id,
      });

      setUnitNumber("");
    } catch {
      return;
    }
  };

  if (buildingLoading) {
    return (
      <PageTransition>
        <div className="mx-auto w-full max-w-7xl space-y-6">
          <div className="h-5 w-40 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />

          <div className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />

          <div className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  if (buildingError || !building) {
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

          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-10 text-center shadow-sm dark:border-red-900/40 dark:bg-red-950/20">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <Building2 className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-xl font-bold text-red-800 dark:text-red-300">
              Building not found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-700/80 dark:text-red-400/80">
              The building you're looking for doesn't exist or could not be
              loaded.
            </p>

            <Link
              to="/communities"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
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
          to={`/communities/${building.communityId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Community
        </Link>

        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 sm:p-8">
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Building2 className="h-7 w-7" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <Building2 className="h-4 w-4" />
                  Building
                </div>

                <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  {building.name}
                </h1>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Manage units and property information for this building.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Building ID
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                  #{building.id}
                </p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 shadow-sm dark:border-blue-900/40 dark:bg-blue-950/20">
                <p className="text-[11px] font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  Units
                </p>

                <p className="mt-1 text-lg font-bold text-blue-700 dark:text-blue-300">
                  {units.length}
                </p>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-40 w-40 rounded-full bg-slate-400/10 blur-3xl" />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Plus className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Add Unit
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Create a new residential unit inside {building.name}.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCreateUnit}
            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:p-6"
          >
            <div className="flex-1">
              <label
                htmlFor="unitNumber"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Unit Number
              </label>

              <input
                id="unitNumber"
                type="text"
                value={unitNumber}
                onChange={(event) => setUnitNumber(event.target.value)}
                placeholder="e.g. A-101"
                disabled={createUnitMutation.isPending}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={createUnitMutation.isPending || !unitNumber.trim()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <Plus className="h-4 w-4" />

              {createUnitMutation.isPending ? "Adding..." : "Add Unit"}
            </button>
          </form>

          {createUnitMutation.isError && (
            <div className="mx-5 mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 sm:mx-6 sm:mb-6">
              Failed to create unit. Please try again.
            </div>
          )}
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Layers3 className="h-5 w-5 text-slate-500 dark:text-slate-400" />

                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Units
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Residential units currently registered in {building.name}.
              </p>
            </div>

            {!unitsLoading && !unitsError && (
              <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Home className="h-3.5 w-3.5" />
                {units.length} {units.length === 1 ? "unit" : "units"}
              </div>
            )}
          </div>

          {unitsLoading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                />
              ))}
            </div>
          )}

          {unitsError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/40 dark:bg-red-950/20">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <Home className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-red-800 dark:text-red-300">
                Unable to load units
              </h3>

              <p className="mt-1 text-sm text-red-700/80 dark:text-red-400/80">
                Please refresh the page and try again.
              </p>
            </div>
          )}

          {!unitsLoading && !unitsError && units.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Home className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-slate-900 dark:text-white">
                No units yet
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                This building does not have any units yet. Use the form above
                to add the first unit.
              </p>
            </div>
          )}

          {!unitsLoading && !unitsError && units.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {units.map((unit) => (
                <article
                  key={unit.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-white dark:group-hover:text-slate-900">
                      <Home className="h-5 w-5" />
                    </div>

                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                      #{unit.id}
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Unit
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                      {unit.unitNumber}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Building2 className="h-4 w-4" />
                      <span>Building #{unit.buildingId}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      Residential unit
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 transition-all group-hover:gap-2.5 dark:text-white">
                      Unit
                      <ArrowUpRight className="h-3.5 w-3.5" />
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

export default BuildingDetails;

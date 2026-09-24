import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Home, Plus } from "lucide-react";

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
          <div className="h-5 w-40 animate-pulse rounded-lg bg-muted" />

          <div className="h-48 animate-pulse rounded-3xl bg-muted" />

          <div className="h-40 animate-pulse rounded-3xl bg-muted" />
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
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Communities
          </Link>

          <div className="mt-8 rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
            <Building2 className="mx-auto h-10 w-10 text-muted-foreground" />

            <h1 className="mt-4 text-xl font-semibold text-foreground">
              Building not found
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              The building you're looking for doesn't exist or could not be
              loaded.
            </p>
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
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Community
        </Link>

        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="relative z-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Building2 className="h-7 w-7" />
            </div>

            <p className="mt-6 text-sm font-medium text-primary">Building</p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {building.name}
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              Building ID: #{building.id}
            </p>
          </div>

          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
        </section>

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Plus className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-foreground">Add Unit</h2>

                <p className="text-sm text-muted-foreground">
                  Create a unit inside this building.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleCreateUnit}
            className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:p-8"
          >
            <div className="flex-1">
              <label
                htmlFor="unitNumber"
                className="mb-2 block text-sm font-medium text-foreground"
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
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={createUnitMutation.isPending || !unitNumber.trim()}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />

              {createUnitMutation.isPending ? "Adding..." : "Add Unit"}
            </button>
          </form>

          {createUnitMutation.isError && (
            <div className="mx-6 mb-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive sm:mx-8">
              Failed to create unit. Please try again.
            </div>
          )}
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-foreground">Units</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {units.length} unit{units.length === 1 ? "" : "s"} in this
              building
            </p>
          </div>

          {unitsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-2xl bg-muted"
                />
              ))}
            </div>
          ) : unitsError ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
              Failed to load units. Please refresh and try again.
            </div>
          ) : units.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
              <Home className="mx-auto h-10 w-10 text-muted-foreground" />

              <h3 className="mt-4 font-semibold text-foreground">
                No units yet
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Add the first unit using the form above.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Home className="h-5 w-5" />
                    </div>

                    <span className="text-xs font-medium text-muted-foreground">
                      #{unit.id}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    Unit {unit.unitNumber}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Building #{unit.buildingId}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}

export default BuildingDetails;

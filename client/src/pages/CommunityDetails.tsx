import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Home, MapPin } from "lucide-react";

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
          <div className="h-10 w-64 animate-pulse rounded-xl bg-muted" />

          <div className="h-32 animate-pulse rounded-3xl bg-card" />
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
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Communities
          </Link>

          <div className="mt-8 rounded-3xl border border-border bg-card p-10 text-center">
            <Building2 className="mx-auto h-10 w-10 text-muted-foreground" />

            <h1 className="mt-4 text-xl font-semibold text-foreground">
              Community not found
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              The requested community could not be found.
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
          to="/communities"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Communities
        </Link>

        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Building2 className="h-7 w-7" />
              </div>

              <div>
                <p className="text-sm font-medium text-primary">
                  Community
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {community.name}
                </h1>

                <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

                  <span>{community.address}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background px-5 py-4">
              <p className="text-xs font-medium text-muted-foreground">
                Community ID
              </p>

              <p className="mt-1 text-xl font-bold text-foreground">
                #{community.id}
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        </section>

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-4 border-b border-border px-6 py-5 sm:px-8">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-foreground">
                Add Building
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Add a building to {community.name}.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCreateBuilding}
            className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:p-8"
          >
            <div className="flex-1">
              <label
                htmlFor="building-name"
                className="mb-2 block text-sm font-medium text-foreground"
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
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <button
              type="submit"
              disabled={createBuildingMutation.isPending}
              className="h-12 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createBuildingMutation.isPending
                ? "Adding..."
                : "Add Building"}
            </button>
          </form>

          {createBuildingMutation.isError && (
            <div className="mx-6 mb-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive sm:mx-8">
              Failed to add building. Please try again.
            </div>
          )}
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-foreground">
              Buildings
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Buildings belonging to this community.
            </p>
          </div>

          {buildingsLoading && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-44 animate-pulse rounded-3xl border border-border bg-card"
                />
              ))}
            </div>
          )}

          {buildingsError && (
            <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center">
              <p className="text-sm text-destructive">
                Unable to load buildings.
              </p>
            </div>
          )}

          {!buildingsLoading &&
            !buildingsError &&
            buildings.length === 0 && (
              <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
                <Building2 className="mx-auto h-9 w-9 text-muted-foreground" />

                <h3 className="mt-4 font-semibold text-foreground">
                  No buildings yet
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Buildings for this community have not been added yet.
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
                    className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                        <Building2 className="h-5 w-5" />
                      </div>

                      <span className="text-xs text-muted-foreground">
                        #{building.id}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-foreground">
                      {building.name}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <Home className="h-4 w-4" />
                      <span>View units</span>
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
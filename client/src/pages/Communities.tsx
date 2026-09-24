import { useState } from "react";
import { Building2, MapPin, Plus, Users, ArrowUpRight } from "lucide-react";

import PageTransition from "../components/ui/PageTransition";
import { useCommunities } from "../features/communities/hooks/useCommunities";
import { useCreateCommunity } from "../features/communities/hooks/useCreateCommunity";
import { Link } from "react-router-dom";

function Communities() {
  const { data: communities = [], isLoading, isError } = useCommunities();
  const createCommunityMutation = useCreateCommunity();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createCommunityMutation.mutateAsync({
        name,
        address,
      });

      setName("");
      setAddress("");
    } catch {
      return;
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-8 shadow-sm sm:px-8">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                <Building2 className="h-3.5 w-3.5" />
                Community Management
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Communities
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Manage residential communities and organize the properties
                connected to your platform.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3">
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                <Building2 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-2xl font-bold text-foreground">
                  {communities.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Total communities
                </p>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        </section>

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-4 border-b border-border px-6 py-5 sm:px-8">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Plus className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-foreground">
                Create a new community
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Add a residential community to your platform.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 p-6 sm:p-8 lg:grid-cols-[1fr_1.4fr_auto] lg:items-end"
          >
            <div>
              <label
                htmlFor="community-name"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Community name
              </label>

              <input
                id="community-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Green Valley Apartments"
                required
                minLength={2}
                maxLength={100}
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div>
              <label
                htmlFor="community-address"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Address
              </label>

              <input
                id="community-address"
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Community address"
                required
                minLength={5}
                maxLength={255}
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <button
              type="submit"
              disabled={createCommunityMutation.isPending}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />

              {createCommunityMutation.isPending
                ? "Creating..."
                : "Create Community"}
            </button>
          </form>

          {createCommunityMutation.isError && (
            <div className="mx-6 mb-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive sm:mx-8">
              Failed to create community. Please check the details and try
              again.
            </div>
          )}
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Your communities
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Communities currently registered on the platform.
              </p>
            </div>

            {!isLoading && communities.length > 0 && (
              <span className="hidden rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground sm:inline-flex">
                {communities.length}{" "}
                {communities.length === 1 ? "community" : "communities"}
              </span>
            )}
          </div>

          {isLoading && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-52 animate-pulse rounded-3xl border border-border bg-card"
                />
              ))}
            </div>
          )}

          {isError && (
            <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center">
              <p className="text-sm font-medium text-destructive">
                Unable to load communities.
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Please try refreshing the page.
              </p>
            </div>
          )}

          {!isLoading && !isError && communities.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Building2 className="h-7 w-7" />
              </div>

              <h3 className="mt-5 font-semibold text-foreground">
                No communities yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Create your first community above to start organizing buildings,
                units, residents, and maintenance operations.
              </p>
            </div>
          )}

          {!isLoading && !isError && communities.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {communities.map((community) => (
                <Link
                  key={community.id}
                  to={`/communities/${community.id}`}
                  className="group relative block overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Building2 className="h-6 w-6" />
                    </div>

                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                      #{community.id}
                    </span>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-foreground">
                      {community.name}
                    </h3>

                    <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

                      <span className="line-clamp-2">{community.address}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Community</span>
                    </div>

                    <Link
                      to={`/communities/${community.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition group-hover:gap-2"
                    >
                      View details
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
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

export default Communities;

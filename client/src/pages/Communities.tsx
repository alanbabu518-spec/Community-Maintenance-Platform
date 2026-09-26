import { useState } from "react";
import {
  Building2,
  MapPin,
  Plus,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import PageTransition from "../components/ui/PageTransition";
import { useCommunities } from "../features/communities/hooks/useCommunities";
import { useCreateCommunity } from "../features/communities/hooks/useCreateCommunity";

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
        <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Building2 className="h-3.5 w-3.5" />
              Community Management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Communities
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              Manage residential communities and organize the properties
              connected to your platform.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {communities.length}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total communities
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Plus className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Create a new community
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add a residential community to your platform.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_1.4fr_auto] lg:items-end"
          >
            <div>
              <label
                htmlFor="community-name"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
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
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />
            </div>

            <div>
              <label
                htmlFor="community-address"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
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
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={createCommunityMutation.isPending}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <Plus className="h-4 w-4" />

              {createCommunityMutation.isPending
                ? "Creating..."
                : "Create Community"}
            </button>
          </form>

          {createCommunityMutation.isError && (
            <div className="mx-5 mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 sm:mx-6 sm:mb-6">
              Failed to create community. Please check the details and try
              again.
            </div>
          )}
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Your communities
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Communities currently registered on the platform.
              </p>
            </div>

            {!isLoading && communities.length > 0 && (
              <span className="hidden rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 sm:inline-flex dark:bg-slate-800 dark:text-slate-400">
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
                  className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                />
              ))}
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <Building2 className="h-5 w-5" />
              </div>

              <p className="mt-4 text-sm font-semibold text-red-700 dark:text-red-400">
                Unable to load communities
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Please try refreshing the page.
              </p>
            </div>
          )}

          {!isLoading && !isError && communities.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Building2 className="h-7 w-7" />
              </div>

              <h3 className="mt-5 font-semibold text-slate-900 dark:text-white">
                No communities yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Create your first community above to start organizing
                buildings, units, residents, and maintenance operations.
              </p>
            </div>
          )}

          {!isLoading && !isError && communities.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {communities.map((community) => (
                <Link
                  key={community.id}
                  to={`/communities/${community.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:focus:ring-slate-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <Building2 className="h-5 w-5" />
                    </div>

                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                      #{community.id}
                    </span>
                  </div>

                  <div className="mt-5">
                    <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                      {community.name}
                    </h3>

                    <div className="mt-3 flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />

                      <span className="line-clamp-2 text-sm leading-5 text-slate-500 dark:text-slate-400">
                        {community.address}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <Users className="h-4 w-4" />
                      <span>Community</span>
                    </div>

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

export default Communities;
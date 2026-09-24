import { AlertTriangle, CheckCircle2, Clock3, Wrench } from "lucide-react";

import PageTransition from "../components/ui/PageTransition";
import { useTechnicianDashboard } from "../features/maintenance/hooks/useTechnicianDashboard";

function TechnicianDashboard() {
  const { data, isLoading, isError } = useTechnicianDashboard();

  if (isLoading) {
    return (
      <PageTransition>
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <div className="space-y-2">
            <div className="h-7 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-72 animate-pulse rounded bg-muted" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl bg-card shadow-sm"
              />
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  if (isError || !data) {
    return (
      <PageTransition>
        <div className="mx-auto w-full max-w-6xl">
          <div className="rounded-2xl bg-destructive/5 p-6 shadow-sm">
            <p className="text-sm font-medium text-destructive">
              Unable to load technician dashboard
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const stats = [
    {
      label: "Assigned",
      value: data.statistics.assignedRequests,
      icon: Wrench,
    },
    {
      label: "In Progress",
      value: data.statistics.inProgressRequests,
      icon: Clock3,
    },
    {
      label: "Resolved",
      value: data.statistics.resolvedRequests,
      icon: CheckCircle2,
    },
    {
      label: "Urgent",
      value: data.statistics.urgentRequests,
      icon: AlertTriangle,
    },
  ];

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Technician Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View and manage your assigned maintenance requests.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-card p-5 shadow-sm dark:border-slate-800"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>

                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>

                <p className="mt-3 text-3xl font-semibold text-foreground">
                  {stat.value}
                </p>
              </article>
            );
          })}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Requests
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your latest assigned maintenance requests.
            </p>
          </div>

          {data.recentRequests.length === 0 ? (
            <div className="rounded-2xl bg-card px-6 py-14 text-center shadow-sm">
              <Wrench className="mx-auto h-6 w-6 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium text-foreground">
                No assigned requests
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Assigned maintenance requests will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentRequests.map((request) => (
                <article
                  key={request.id}
                  className="rounded-2xl bg-card px-5 py-5 shadow-sm transition hover:shadow-md sm:px-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-foreground">
                        {request.title}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {request.category}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                        {request.priority}
                      </span>

                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                        {request.status}
                      </span>
                    </div>
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

export default TechnicianDashboard;

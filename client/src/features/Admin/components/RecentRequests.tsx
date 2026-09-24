import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { dashboardMaintenanceQuery } from "../../dashboard/dashboard.queries";

function RecentRequests() {
  const { data, isLoading, isError } = useQuery(dashboardMaintenanceQuery());

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6">
        <p className="text-sm text-destructive">
          Unable to load recent maintenance requests.
        </p>
      </section>
    );
  }

  const requests = data.requests.slice(0, 5);

  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Recent Maintenance
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest maintenance requests across the platform.
          </p>
        </div>

        <Link
          to="/maintenance"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-700px">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-6 py-4">Request</th>
              <th className="px-6 py-4">Community</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-sm text-muted-foreground"
                >
                  No maintenance requests found.
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {request.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {request.category}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {request.community.name}
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">
                      {request.priority}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecentRequests;

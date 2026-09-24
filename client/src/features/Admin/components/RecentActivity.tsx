import { Clock3 } from "lucide-react";
import { useAdminActivity } from "../hooks/useAdminActivity";

function formatAction(action: string) {
  return action
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatTime(date: string) {
  return new Date(date).toLocaleString();
}

function RecentActivity() {
  const { data, isLoading, isError } = useAdminActivity();

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />

        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6">
        <p className="text-sm text-destructive">
          Unable to load recent activity.
        </p>
      </section>
    );
  }

  const activities = data ?? [];

  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-6 py-5">
        <h2 className="text-lg font-semibold text-foreground">
          Recent Activity
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Recent actions performed on the platform.
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <Clock3 className="mx-auto h-8 w-8 text-muted-foreground" />

          <p className="mt-3 text-sm text-muted-foreground">
            No recent activity.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 px-6 py-4">
              <div className="mt-1 rounded-full bg-muted p-2">
                <Clock3 className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {formatAction(activity.action)}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {activity.actor.name} updated {activity.entity.toLowerCase()}
                  {activity.entityId !== null ? ` #${activity.entityId}` : ""}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {formatTime(activity.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentActivity;

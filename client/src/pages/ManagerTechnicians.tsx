import { Building2, Users } from "lucide-react";
import PageTransition from "../components/ui/PageTransition";
import { useTechnicians } from "../features/users/hooks/useTechnicians";

function ManagerTechnicians() {
  const { data: technicians = [], isLoading, isError } = useTechnicians();

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-6xl">
        <section className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Technicians
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Technicians assigned to your community
          </p>
        </section>

        {isLoading && (
          <div className="rounded-2xl bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">
              Loading technicians...
            </p>
          </div>
        )}

        {isError && (
          <div className="rounded-2xl bg-destructive/5 p-6 shadow-sm">
            <p className="text-sm font-medium text-destructive">
              Unable to load technicians
            </p>
          </div>
        )}

        {!isLoading && !isError && technicians.length === 0 && (
          <div className="rounded-2xl bg-card p-10 text-center shadow-sm">
            <Users className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">
              No technicians found
            </p>
          </div>
        )}

        {!isLoading && !isError && technicians.length > 0 && (
          <div className="space-y-3">
            {technicians.map((technician) => (
              <article
                key={technician.id}
                className="rounded-2xl bg-card px-5 py-5 shadow-md sm:px-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      {technician.name}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {technician.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />

                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                      {technician.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export default ManagerTechnicians;

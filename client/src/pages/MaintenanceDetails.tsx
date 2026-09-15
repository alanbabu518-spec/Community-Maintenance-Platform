import { Link, useParams } from "react-router-dom";
import PageTransition from "../components/ui/PageTransition";
import Loading from "../components/ui/Loading";
import Badge from "../components/ui/Badge";
import useMaintenanceRequest from "../features/maintenance/hooks/useMaintenanceRequest";

function MaintenanceDetails() {
  const { id } = useParams();
  const requestId = Number(id);

  const { data, isLoading, isError } =
    useMaintenanceRequest(requestId);

  if (isLoading) {
    return <Loading type="dashboard" />;
  }

  if (isError || !data) {
    return (
      <PageTransition>
        <div className="mx-auto w-full max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-semibold text-red-800">
              Unable to load maintenance request
            </h1>

            <p className="mt-2 text-sm text-red-700">
              The request could not be found or you are not authorized to
              view it.
            </p>

            <Link
              to="/maintenance"
              className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Back to Maintenance
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const { request } = data;

  const priorityStyles: Record<string, string> = {
    LOW: "bg-slate-100 text-slate-700",
    MEDIUM: "bg-amber-50 text-amber-700",
    HIGH: "bg-orange-50 text-orange-700",
    URGENT: "bg-red-50 text-red-700",
  };

  const statusStyles: Record<string, string> = {
    OPEN: "bg-blue-50 text-blue-700",
    ACKNOWLEDGED: "bg-indigo-50 text-indigo-700",
    ASSIGNED: "bg-purple-50 text-purple-700",
    IN_PROGRESS: "bg-amber-50 text-amber-700",
    RESOLVED: "bg-emerald-50 text-emerald-700",
    CLOSED: "bg-slate-100 text-slate-700",
  };

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div>
          <Link
            to="/maintenance"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Back to Maintenance
          </Link>

          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500">
              Maintenance Request #{request.id}
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {request.title}
            </h1>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Request Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Information about this maintenance issue.
                </p>
              </div>

              <Badge
                className={
                  statusStyles[request.status] ??
                  "bg-slate-100 text-slate-700"
                }
              >
                {request.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Description
              </p>

              <p className="mt-2 text-sm leading-7 text-slate-700">
                {request.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Category
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {request.category}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Priority
                </p>

                <div className="mt-1">
                  <Badge
                    className={
                      priorityStyles[request.priority] ??
                      "bg-slate-100 text-slate-700"
                    }
                  >
                    {request.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Unit
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {request.unit.unitNumber}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Location
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {request.unit.building.name}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {request.unit.building.community.name}
              </p>

              <p className="text-sm text-slate-500">
                {request.unit.building.community.address}
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Submitted
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        {request.attachments.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Photos
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Photos attached to this maintenance issue.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {request.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                  <img
                    src={attachment.fileUrl}
                    alt={attachment.fileName}
                    className="aspect-square w-full object-cover transition duration-200 group-hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Assigned Technician
          </h2>

          {request.technician ? (
            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-900">
                {request.technician.name}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {request.technician.email}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              No technician has been assigned yet.
            </p>
          )}
        </section>
      </div>
    </PageTransition>
  );
}

export default MaintenanceDetails;
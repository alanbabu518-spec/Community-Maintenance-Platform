import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import PageTransition from "../components/ui/PageTransition";
import Loading from "../components/ui/Loading";
import Badge from "../components/ui/Badge";
import useMaintenanceRequest from "../features/maintenance/hooks/useMaintenanceRequest";
import { useAuth } from "../context/AuthContext";
import useUpdateMaintenanceRequest from "../features/maintenance/hooks/useUpdateMaintenanceRequest";
import useAssignMaintenanceRequest from "../features/maintenance/hooks/useAssignMaintenanceRequest";
import type { UpdateMaintenanceRequestInput } from "../services/maintenance.api";
import { getTechnicians } from "../services/users.api";
import { ApiError } from "../services/apiClient";
import ErrorPage from "../components/ui/ErrorPage";

function MaintenanceDetails() {
  const { id } = useParams();
  const requestId = Number(id);
  const { user } = useAuth();

  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");

  const { data, isLoading, isError, error, refetch } =
    useMaintenanceRequest(requestId);

  const statusMutation = useUpdateMaintenanceRequest(requestId);
  const assignMutation = useAssignMaintenanceRequest(requestId);

  const isManager = user?.role === "ADMIN" || user?.role === "MANAGER";

  const canAssign =
    isManager &&
    requestId > 0 &&
    data?.request.status === "ACKNOWLEDGED" &&
    !data?.request.technician;

  const {
    data: technicians = [],
    isLoading: techniciansLoading,
    isError: techniciansError,
  } = useQuery({
    queryKey: ["technicians"],
    queryFn: getTechnicians,
    enabled: canAssign,
    staleTime: 5 * 60 * 1000,
  });
  if (isLoading) {
    return <Loading type="dashboard" />;
  }

  if (isError || !data) {
    const status = error instanceof ApiError ? error.status : 0;

    if (status === 403) {
      return (
        <ErrorPage
          title="Access Denied"
          message="You are not authorized to view this maintenance request."
          errorCode="403"
          onBack={() => window.history.back()}
        />
      );
    }

    if (status === 404) {
      return (
        <ErrorPage
          title="Request Not Found"
          message="The maintenance request you are looking for does not exist or may have been removed."
          errorCode="404"
          onBack={() => window.history.back()}
        />
      );
    }

    if (status === 401) {
      return (
        <ErrorPage
          title="Session Expired"
          message="Your session has expired. Please sign in again."
          errorCode="401"
          onBack={() => window.history.back()}
        />
      );
    }

    return (
      <ErrorPage
        title="Unable to Load Request"
        message="We couldn't load this maintenance request. Please try again."
        errorCode="500"
        onRetry={() => refetch()}
        onBack={() => window.history.back()}
      />
    );
  }

  const { request } = data;

  const priorityStyles: Record<string, string> = {
    LOW: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    MEDIUM:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    HIGH: "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
    URGENT: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  };

  const statusStyles: Record<string, string> = {
    OPEN: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    ACKNOWLEDGED:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
    ASSIGNED:
      "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
    IN_PROGRESS:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    RESOLVED:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    CLOSED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };

  const updateStatus = (status: UpdateMaintenanceRequestInput["status"]) => {
    if (!status || statusMutation.isPending) {
      return;
    }

    statusMutation.mutate({ status });
  };

  const assignTechnician = () => {
    if (!selectedTechnicianId || assignMutation.isPending) {
      return;
    }

    assignMutation.mutate(
      {
        technicianId: Number(selectedTechnicianId),
      },
      {
        onSuccess: () => {
          setSelectedTechnicianId("");
        },
      },
    );
  };

  const canAcknowledge =
    (user?.role === "ADMIN" || user?.role === "MANAGER") &&
    request.status === "OPEN";

  const canStartWork =
    user?.role === "TECHNICIAN" && request.status === "ASSIGNED";

  const canResolve =
    user?.role === "TECHNICIAN" && request.status === "IN_PROGRESS";

  const canClose =
    (user?.role === "ADMIN" || user?.role === "MANAGER") &&
    request.status === "RESOLVED";

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div>
          <Link
            to="/maintenance"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            ← Back to Maintenance
          </Link>

          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Maintenance Request #{request.id}
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {request.title}
            </h1>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Request Details
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Information about this maintenance issue.
                </p>
              </div>

              <Badge
                className={
                  statusStyles[request.status] ??
                  "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }
              >
                {request.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Description
              </p>

              <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">
                {request.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Category
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {request.category}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Priority
                </p>

                <div className="mt-1">
                  <Badge
                    className={
                      priorityStyles[request.priority] ??
                      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }
                  >
                    {request.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Unit
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                  {request.unit.unitNumber}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Location
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {request.unit.building.name}
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {request.unit.building.community.name}
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {request.unit.building.community.address}
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Submitted
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        {canAssign && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Assign Technician
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Select a technician to handle this maintenance request.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <select
                value={selectedTechnicianId}
                onChange={(event) =>
                  setSelectedTechnicianId(event.target.value)
                }
                disabled={techniciansLoading || assignMutation.isPending}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800 sm:max-w-md"
              >
                <option value="">
                  {techniciansLoading
                    ? "Loading technicians..."
                    : "Select a technician"}
                </option>

                {technicians.map((technician) => (
                  <option key={technician.id} value={technician.id}>
                    {technician.name} — {technician.email}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={assignTechnician}
                disabled={
                  !selectedTechnicianId ||
                  techniciansLoading ||
                  assignMutation.isPending
                }
                className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {assignMutation.isPending
                  ? "Assigning..."
                  : "Assign Technician"}
              </button>
            </div>

            {techniciansError && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400">
                Failed to load technicians. Please try again.
              </p>
            )}

            {assignMutation.isError && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400">
                Failed to assign technician. Please try again.
              </p>
            )}

            {!techniciansLoading &&
              !techniciansError &&
              technicians.length === 0 && (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  No technicians are currently available.
                </p>
              )}
          </section>
        )}

        {(canAcknowledge || canStartWork || canResolve || canClose) && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Request Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Update the maintenance request status.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {canAcknowledge && (
                <button
                  type="button"
                  onClick={() => updateStatus("ACKNOWLEDGED")}
                  disabled={statusMutation.isPending}
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {statusMutation.isPending
                    ? "Updating..."
                    : "Acknowledge Request"}
                </button>
              )}

              {canStartWork && (
                <button
                  type="button"
                  onClick={() => updateStatus("IN_PROGRESS")}
                  disabled={statusMutation.isPending}
                  className="rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {statusMutation.isPending ? "Updating..." : "Start Work"}
                </button>
              )}

              {canResolve && (
                <button
                  type="button"
                  onClick={() => updateStatus("RESOLVED")}
                  disabled={statusMutation.isPending}
                  className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {statusMutation.isPending ? "Updating..." : "Mark Resolved"}
                </button>
              )}

              {canClose && (
                <button
                  type="button"
                  onClick={() => updateStatus("CLOSED")}
                  disabled={statusMutation.isPending}
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  {statusMutation.isPending ? "Updating..." : "Close Request"}
                </button>
              )}
            </div>

            {statusMutation.isError && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400">
                Failed to update the request. Please try again.
              </p>
            )}
          </section>
        )}

        {request.attachments.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Photos
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
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

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Assigned Technician
          </h2>

          {request.technician ? (
            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {request.technician.name}
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {request.technician.email}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              No technician has been assigned yet.
            </p>
          )}
        </section>
      </div>
    </PageTransition>
  );
}

export default MaintenanceDetails;

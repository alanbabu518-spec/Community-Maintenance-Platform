import Badge from "../../../components/ui/Badge";
import type { MaintenanceRequest } from "../types";

interface MaintenanceCardProps {
  request: MaintenanceRequest;
}

function MaintenanceCard({ request }: MaintenanceCardProps) {
  const priorityStyles: Record<string, string> = {
    LOW: "bg-slate-100 text-slate-700",
    MEDIUM: "bg-amber-50 text-amber-700",
    HIGH: "bg-orange-50 text-orange-700",
    URGENT: "bg-red-50 text-red-700",
  };

  const statusStyles: Record<string, string> = {
    OPEN: "bg-blue-50 text-blue-700",
    ASSIGNED: "bg-purple-50 text-purple-700",
    IN_PROGRESS: "bg-amber-50 text-amber-700",
    RESOLVED: "bg-emerald-50 text-emerald-700",
    CLOSED: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-4 transition duration-200 hover:border-slate-300 hover:shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
            {request.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {request.description}
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

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge className="bg-slate-100 text-slate-700">
          {request.category}
        </Badge>

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
  );
}

export default MaintenanceCard;
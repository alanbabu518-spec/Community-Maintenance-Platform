import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Wrench } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import type { MaintenanceRequest } from "../types/maintenance.types";

interface MaintenanceCardProps {
  request: MaintenanceRequest;
}

const MaintenanceCard = memo(function MaintenanceCard({
  request,
}: MaintenanceCardProps) {
  const priorityStyles: Record<string, string> = {
    LOW: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    MEDIUM:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    HIGH:
      "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
    URGENT:
      "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 animate-pulse",
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
    CLOSED:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <Link
      to={`/maintenance/${request.id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50/60 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800/40 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 gap-3">
          <div className="mt-0.5 hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:flex">
            <Wrench className="h-4 w-4" strokeWidth={2} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
              {request.title}
            </h3>

            <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {request.description}
            </p>
          </div>
        </div>

        <Badge
          className={`shrink-0 ${
            statusStyles[request.status] ??
            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {request.status}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {request.category}
          </Badge>

          <Badge
            className={
              priorityStyles[request.priority] ??
              "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }
          >
            {request.priority}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-sm font-medium text-slate-400 transition group-hover:gap-1.5 group-hover:text-slate-900 dark:text-slate-500 dark:group-hover:text-white">
          View details
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
        </div>
      </div>
    </Link>
  );
});

export default MaintenanceCard;
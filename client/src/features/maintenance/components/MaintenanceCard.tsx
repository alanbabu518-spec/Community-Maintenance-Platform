import Badge from "../../../components/ui/Badge";
import type { MaintenanceRequest } from "../types";

interface MaintenanceCardProps {
  request: MaintenanceRequest;
}

function MaintenanceCard({ request }: MaintenanceCardProps) {
  const priorityStyles: Record<string, string> = {
    LOW: "bg-gray-100 text-gray-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
  };

  const statusStyles: Record<string, string> = {
    OPEN: "bg-blue-100 text-blue-700",
    ASSIGNED: "bg-purple-100 text-purple-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-green-100 text-green-700",
    CLOSED: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900">
        {request.title}
      </h3>

      <p className="text-sm text-gray-600 mt-2">
        {request.description}
      </p>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge className="bg-gray-100 text-gray-700">
          {request.category}
        </Badge>

        <Badge
          className={
            priorityStyles[request.priority] ??
            "bg-gray-100 text-gray-700"
          }
        >
          {request.priority}
        </Badge>

        <Badge
          className={
            statusStyles[request.status] ??
            "bg-gray-100 text-gray-700"
          }
        >
          {request.status}
        </Badge>
      </div>
    </div>
  );
}

export default MaintenanceCard;
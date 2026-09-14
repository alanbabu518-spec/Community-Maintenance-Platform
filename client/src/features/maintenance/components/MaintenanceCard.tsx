import type { MaintenanceRequest } from "../types";

interface MaintenanceCardProps {
  request: MaintenanceRequest;
}

function MaintenanceCard({ request }: MaintenanceCardProps) {
  return (
    <div>
      <h3>{request.title}</h3>

      <p>{request.description}</p>

      <p>Category: {request.category}</p>
      <p>Priority: {request.priority}</p>
      <p>Status: {request.status}</p>
    </div>
  );
}

export default MaintenanceCard;

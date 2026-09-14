import { useEffect, useState } from "react";
import { getMaintenanceRequests } from "../services/api";
import MaintenanceCard from "../features/maintenance/components/MaintenanceCard";

interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
}

function Maintenance() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);

        const result = await getMaintenanceRequests();

        setRequests(result.requests);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load maintenance requests",
        );
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  if (loading) {
    return <p>Loading maintenance requests...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Maintenance Requests</h1>

      {requests.length === 0 ? (
        <p>No maintenance requests found.</p>
      ) : (
        requests.map((request) => (
          <MaintenanceCard key={request.id} request={request} />
        ))
      )}
    </div>
  );
}

export default Maintenance;

import { useEffect, useState } from "react";
import { getMaintenanceRequests } from "../services/api";
import MaintenanceCard from "../features/maintenance/components/MaintenanceCard";
import type { MaintenanceRequest } from "../features/maintenance/types";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import PageTransition from "../components/ui/PageTransition";

function Maintenance() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

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
  };

  useEffect(() => {
    loadRequests();
  }, []);

  if (loading) {
    return <Loading type="list" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadRequests} />;
  }

  return (
    <PageTransition>
      <div>
        <h1>Maintenance Requests</h1>

        {requests.length === 0 ? (
          <p>No maintenance requests found.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <MaintenanceCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export default Maintenance;

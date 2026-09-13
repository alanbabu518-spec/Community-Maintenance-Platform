import { useEffect, useState } from "react";
import {
  getHealth,
  getMaintenanceRequests,
} from "./services/api";
import type { MaintenanceRequest } from "./types/api";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const health = await getHealth();

        if (health.status === "ok") {
          setBackendStatus("Connected ✅");
        }

        const data = await getMaintenanceRequests();

        setRequests(data.requests);
      } catch {
        setError("Failed to load maintenance requests");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div>
      <h1>Community Maintenance Platform</h1>

      <p>Backend Status: {backendStatus}</p>

      {loading && <p>Loading maintenance requests...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div>
          <h2>Maintenance Requests</h2>

          {requests.length === 0 ? (
            <p>No maintenance requests found.</p>
          ) : (
            requests.map((request) => (
              <div key={request.id}>
                <h3>{request.title}</h3>
                <p>{request.description}</p>
                <p>Priority: {request.priority}</p>
                <p>Status: {request.status}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;
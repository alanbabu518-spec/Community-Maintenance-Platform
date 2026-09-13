import { useEffect, useState } from "react";
import { getHealth, getMaintenanceRequests } from "./services/api";
import type { MaintenanceRequest } from "./types/api";
import { loginUser } from "./services/api";

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
          setBackendStatus("Connected !");
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

  const handleLogin = async () => {
    try {
      const result = await loginUser({
        email: "tester999@example.com",
        password: "Password123",
      });

      console.log("Login successful:", result);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLoadRequests = async () => {
    try {
      const result = await getMaintenanceRequests();

      console.log("Maintenance requests:", result);
    } catch (error) {
      console.error("Failed to load requests:", error);
    }
  };

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

      <button onClick={handleLogin}>Test Login</button>

      <button onClick={handleLoadRequests}>Load Maintenance Requests</button>
    </div>
  );
}

export default App;

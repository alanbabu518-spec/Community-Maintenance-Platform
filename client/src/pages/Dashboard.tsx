import { useEffect, useMemo, useState } from "react";
import { getMaintenanceRequests } from "../services/maintenance.api";
import StatCard from "../components/ui/StatCard";
import MaintenanceCard from "../features/maintenance/components/MaintenanceCard";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { MaintenanceRequest } from "../features/maintenance/types";
import Loading from "../components/ui/Loading";
import PageTransition from "../components/ui/PageTransition";

function Dashboard() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadRequests() {
      try {
        const result = await getMaintenanceRequests();
        setRequests(result.requests);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  const statistics = useMemo(() => {
    let open = 0;
    let assigned = 0;
    let resolved = 0;

    for (const request of requests) {
      if (request.status === "OPEN") open++;
      if (request.status === "ASSIGNED") assigned++;
      if (request.status === "RESOLVED") resolved++;
    }

    return {
      total: requests.length,
      open,
      assigned,
      resolved,
    };
  }, [requests]);

  if (loading) {
    return <Loading type="dashboard" />;
  }

  return (
    <PageTransition>
      <div>
        <h1>Dashboard</h1>

        <p>Welcome to the Community Maintenance Platform.</p>

        {user?.role === "RESIDENT" && (
          <p>Report and track your maintenance requests.</p>
        )}

        {user?.role === "TECHNICIAN" && (
          <p>View and manage your assigned maintenance requests.</p>
        )}

        {user?.role === "MANAGER" && (
          <p>Manage maintenance requests and technician assignments.</p>
        )}

        {user?.role === "ADMIN" && (
          <p>Manage the community platform and its users.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            background: "lightblue",
          }}
        >
          <StatCard title="Total Requests" value={statistics.total} />
          <StatCard title="Open Requests" value={statistics.open} />
          <StatCard title="Assigned Requests" value={statistics.assigned} />
          <StatCard title="Resolved Requests" value={statistics.resolved} />
        </div>

        <h2>Recent Maintenance Requests</h2>

        {requests.length === 0 ? (
          <p>No maintenance requests found.</p>
        ) : (
          requests
            .slice(0, 5)
            .map((request) => (
              <MaintenanceCard key={request.id} request={request} />
            ))
        )}

        <Link to="/maintenance">View All Maintenance Requests</Link>
      </div>
    </PageTransition>
  );
}

export default Dashboard;

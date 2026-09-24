import {
  countActiveCommunities,
  countOpenRequests,
  countRequestsByStatus,
  countResidents,
  countStaff,
  countUrgentRequests,
} from "./admin.repository.js";

export const getAdminDashboard = async () => {
  const [
    residents,
    staff,
    openRequests,
    activeCommunities,
    acknowledgedRequests,
    assignedRequests,
    inProgressRequests,
    resolvedRequests,
    closedRequests,
    urgentRequests,
  ] = await Promise.all([
    countResidents(),
    countStaff(),
    countOpenRequests(),
    countActiveCommunities(),
    countRequestsByStatus("ACKNOWLEDGED"),
    countRequestsByStatus("ASSIGNED"),
    countRequestsByStatus("IN_PROGRESS"),
    countRequestsByStatus("RESOLVED"),
    countRequestsByStatus("CLOSED"),
    countUrgentRequests(),
  ]);

  return {
    residents,
    staff,
    openRequests,
    activeCommunities,
    acknowledgedRequests,
    assignedRequests,
    inProgressRequests,
    resolvedRequests,
    closedRequests,
    urgentRequests,
  };
};

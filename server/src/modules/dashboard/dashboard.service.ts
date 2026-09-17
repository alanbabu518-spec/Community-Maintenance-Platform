import {
  countAssignedRequests,
  countOpenRequests,
  countResolvedRequests,
  countTotalRequests,
} from "../dashboard/dashboard.repository.js";
import type { DashboardStats } from "../dashboard/dashboard.types.js";

export const getDashboardStats = async (
  userId: number,
  role: string
): Promise<DashboardStats> => {
  const [
    totalRequests,
    openRequests,
    assignedRequests,
    resolvedRequests,
  ] = await Promise.all([
    countTotalRequests(userId, role),
    countOpenRequests(userId, role),
    countAssignedRequests(userId, role),
    countResolvedRequests(userId, role),
  ]);

  return {
    totalRequests,
    openRequests,
    assignedRequests,
    resolvedRequests,
  };
};
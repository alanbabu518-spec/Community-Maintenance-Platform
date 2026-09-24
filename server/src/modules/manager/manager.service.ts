import { UserRole } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import { userRepository } from "../users/user.repository.js";

import {
  countCommunityRequests,
  countCommunityRequestsByStatus,
  countCommunityUrgentRequests,
  getRecentCommunityRequests,
  getCommunityTechnicians,
} from "./manager.repository.js";

export const getManagerDashboard = async (userId: number) => {
  const manager = await userRepository.findById(userId);

  if (!manager) {
    throw new AppError("Manager not found", 404);
  }

  if (manager.role !== UserRole.MANAGER) {
    throw new AppError("Access denied", 403);
  }

  const communityId =
    manager.communityId ??
    manager.unit?.building?.communityId ??
    null;

  if (!communityId) {
    throw new AppError(
      "You are not assigned to a community",
      403,
    );
  }

  const [
    totalRequests,
    openRequests,
    acknowledgedRequests,
    assignedRequests,
    inProgressRequests,
    resolvedRequests,
    closedRequests,
    urgentRequests,
    recentRequests,
    technicians,
  ] = await Promise.all([
    countCommunityRequests(communityId),
    countCommunityRequestsByStatus(communityId, "OPEN"),
    countCommunityRequestsByStatus(communityId, "ACKNOWLEDGED"),
    countCommunityRequestsByStatus(communityId, "ASSIGNED"),
    countCommunityRequestsByStatus(communityId, "IN_PROGRESS"),
    countCommunityRequestsByStatus(communityId, "RESOLVED"),
    countCommunityRequestsByStatus(communityId, "CLOSED"),
    countCommunityUrgentRequests(communityId),
    getRecentCommunityRequests(communityId),
    getCommunityTechnicians(communityId),
  ]);

  return {
    communityId,
    statistics: {
      totalRequests,
      openRequests,
      acknowledgedRequests,
      assignedRequests,
      inProgressRequests,
      resolvedRequests,
      closedRequests,
      urgentRequests,
    },
    recentRequests,
    technicians,
  };
};
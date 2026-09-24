export interface AdminDashboardStats {
  residents: number;
  staff: number;
  openRequests: number;
  activeCommunities: number;

  acknowledgedRequests: number;
  assignedRequests: number;
  inProgressRequests: number;
  resolvedRequests: number;
  closedRequests: number;
  urgentRequests: number;
}
import type { MaintenanceQueryParams } from "../../services/maintenance.api";

export const maintenanceKeys = {
  all: ["maintenance-requests"] as const,

  lists: () => [...maintenanceKeys.all, "list"] as const,

  list: (params: MaintenanceQueryParams) =>
    [...maintenanceKeys.lists(), params] as const,

  details: () => [...maintenanceKeys.all, "detail"] as const,

  detail: (id: number) =>
    [...maintenanceKeys.details(), id] as const,
};
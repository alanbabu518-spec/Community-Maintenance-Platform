export interface CreateMaintenanceRequestInput {
  title: string;
  description: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  unitId: number;
}

export interface UpdateMaintenanceRequestInput {
  status?:
    | "OPEN"
    | "ACKNOWLEDGED"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED"
    | undefined;

  priority?:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT"
    | undefined;

  category?: string | undefined;

  technicianId?: number | undefined;
}
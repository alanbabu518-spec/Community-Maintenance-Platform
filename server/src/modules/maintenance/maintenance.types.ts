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

  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;

  category?: string | undefined;

  technicianId?: number | undefined;
}

export interface MaintenanceFilters {
  status?:
    | "OPEN"
    | "ACKNOWLEDGED"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED"
    | undefined;

  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;

  category?: string | undefined;
}

export interface MaintenanceRequestResponse {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status:
    | "OPEN"
    | "ACKNOWLEDGED"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED";
  residentId: number;
  unitId: number;
  technicianId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceRequestDetailResponse extends MaintenanceRequestResponse {
  resident: {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER" | "RESIDENT" | "TECHNICIAN";
  };

  unit: {
    id: number;
    unitNumber: string;
    building: {
      id: number;
      name: string;
      community: {
        id: number;
        name: string;
        address: string;
      };
    };
  };

  technician: {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER" | "RESIDENT" | "TECHNICIAN";
  } | null;
}

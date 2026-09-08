import type { MaintenanceRequest } from "@prisma/client";
import type {
  MaintenanceRequestDetailResponse,
  MaintenanceRequestResponse,
} from "./maintenance.types.js";

export function toMaintenanceRequestResponse(
  request: MaintenanceRequest,
): MaintenanceRequestResponse {
  return {
    id: request.id,
    title: request.title,
    description: request.description,
    category: request.category,
    priority: request.priority,
    status: request.status,
    residentId: request.residentId,
    unitId: request.unitId,
    technicianId: request.technicianId,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  };
}

type MaintenanceRequestWithDetails = {
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
};

export function toMaintenanceRequestDetailResponse(
  request: MaintenanceRequestWithDetails,
): MaintenanceRequestDetailResponse {
  return {
    id: request.id,
    title: request.title,
    description: request.description,
    category: request.category,
    priority: request.priority,
    status: request.status,
    residentId: request.residentId,
    unitId: request.unitId,
    technicianId: request.technicianId,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,

    resident: {
      id: request.resident.id,
      name: request.resident.name,
      email: request.resident.email,
      role: request.resident.role,
    },

    unit: {
      id: request.unit.id,
      unitNumber: request.unit.unitNumber,

      building: {
        id: request.unit.building.id,
        name: request.unit.building.name,

        community: {
          id: request.unit.building.community.id,
          name: request.unit.building.community.name,
          address: request.unit.building.community.address,
        },
      },
    },

    technician: request.technician
      ? {
          id: request.technician.id,
          name: request.technician.name,
          email: request.technician.email,
          role: request.technician.role,
        }
      : null,
  };
}
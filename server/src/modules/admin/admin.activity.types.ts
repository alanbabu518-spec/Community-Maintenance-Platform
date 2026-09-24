export interface AdminActivityResponse {
  id: number;
  action: string;
  entity: string;
  entityId: number | null;
  metadata: unknown;
  createdAt: Date;

  actor: {
    id: number;
    name: string;
    role: "ADMIN" | "MANAGER" | "RESIDENT" | "TECHNICIAN";
  };
}
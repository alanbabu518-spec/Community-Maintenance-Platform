export interface CreateMaintenanceRequestInput {
  title: string;
  description: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  unitId: number;
}
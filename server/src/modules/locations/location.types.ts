export interface CommunitySummary {
  id: number;
  name: string;
  address: string;
}

export interface BuildingSummary {
  id: number;
  name: string;
  communityId: number;
}

export interface UnitSummary {
  id: number;
  unitNumber: string;
  buildingId: number;
}
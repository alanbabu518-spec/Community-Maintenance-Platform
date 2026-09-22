import apiClient from "./apiClient";

export interface Community {
  id: number;
  name: string;
  address: string;
}

export interface Building {
  id: number;
  name: string;
  communityId: number;
}

export interface Unit {
  id: number;
  unitNumber: string;
  buildingId: number;
}

export async function getCommunities(): Promise<{
  communities: Community[];
}> {
  return apiClient("/locations/communities");
}

export async function getBuildings(
  communityId: number,
): Promise<{
  buildings: Building[];
}> {
  return apiClient(
    `/locations/communities/${communityId}/buildings`,
  );
}

export async function getUnits(
  buildingId: number,
): Promise<{
  units: Unit[];
}> {
  return apiClient(
    `/locations/buildings/${buildingId}/units`,
  );
}
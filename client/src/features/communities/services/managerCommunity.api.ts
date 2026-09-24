import apiClient from "../../../services/apiClient";

export interface ManagerCommunity {
  id: number;
  name: string;
  address: string;
}

export interface ManagerBuilding {
  id: number;
  name: string;
  communityId: number;
}

interface ManagerCommunityResponse {
  community: ManagerCommunity;
}

interface ManagerBuildingsResponse {
  buildings: ManagerBuilding[];
}

export async function getManagerCommunity(): Promise<ManagerCommunity> {
  const response = await apiClient<ManagerCommunityResponse>(
    "/locations/my-community",
  );

  return response.community;
}

export async function getManagerBuildings(
  communityId: number,
): Promise<ManagerBuilding[]> {
  const response = await apiClient<ManagerBuildingsResponse>(
    `/locations/communities/${communityId}/buildings`,
  );

  return response.buildings;
}

export interface ManagerUnit {
  id: number;
  unitNumber: string;
  buildingId: number;
}

interface ManagerUnitsResponse {
  units: ManagerUnit[];
}

export async function getManagerUnits(
  buildingId: number,
): Promise<ManagerUnit[]> {
  const response = await apiClient<ManagerUnitsResponse>(
    `/locations/buildings/${buildingId}/units`,
  );

  return response.units;
}

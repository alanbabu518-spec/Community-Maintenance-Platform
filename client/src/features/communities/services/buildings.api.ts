import apiClient from "../../../services/apiClient";

export interface Building {
  id: number;
  name: string;
  communityId: number;
}

interface BuildingsResponse {
  buildings: Building[];
}

export async function getBuildings(communityId: number): Promise<Building[]> {
  const response = await apiClient<BuildingsResponse>(
    `/locations/communities/${communityId}/buildings`,
  );

  return response.buildings;
}

export async function createBuilding(data: {
  name: string;
  communityId: number;
}): Promise<Building> {
  const response = await apiClient<{
    message: string;
    building: Building;
  }>(`/locations/communities/${data.communityId}/buildings`, {
    method: "POST",
    body: JSON.stringify({
      name: data.name,
    }),
  });

  return response.building;
}
export async function getBuildingById(buildingId: number): Promise<Building> {
  const response = await apiClient<{ building: Building }>(
    `/locations/buildings/${buildingId}`,
  );

  return response.building;
}

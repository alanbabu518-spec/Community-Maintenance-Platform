import apiClient from "../../../services/apiClient";

export interface Unit {
  id: number;
  unitNumber: string;
  buildingId: number;
}

interface UnitsResponse {
  units: Unit[];
}

export async function getUnits(buildingId: number): Promise<Unit[]> {
  const response = await apiClient<UnitsResponse>(
    `/locations/buildings/${buildingId}/units`,
  );

  return response.units;
}

export async function createUnit(data: {
  unitNumber: string;
  buildingId: number;
}): Promise<Unit> {
  const response = await apiClient<{
    message: string;
    unit: Unit;
  }>(`/locations/buildings/${data.buildingId}/units`, {
    method: "POST",
    body: JSON.stringify({
      unitNumber: data.unitNumber,
    }),
  });

  return response.unit;
}

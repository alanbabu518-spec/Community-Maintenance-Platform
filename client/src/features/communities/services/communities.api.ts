import apiClient from "../../../services/apiClient";

export interface Community {
  id: number;
  name: string;
  address: string;
}

interface CommunitiesResponse {
  communities: Community[];
}

export async function getCommunities(): Promise<Community[]> {
  const response = await apiClient<CommunitiesResponse>(
    "/locations/communities",
  );

  return response.communities;
}

export async function createCommunity(data: {
  name: string;
  address: string;
}): Promise<Community> {
  const response = await apiClient<{
    message: string;
    community: Community;
  }>("/locations/communities", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.community;
}

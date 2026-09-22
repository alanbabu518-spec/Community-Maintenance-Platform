import { locationRepository } from "./location.repository.js";

export const locationService = {
  async getCommunities() {
    return locationRepository.findCommunities();
  },

  async getBuildingsByCommunityId(communityId: number) {
    return locationRepository.findBuildingsByCommunityId(communityId);
  },

  async getUnitsByBuildingId(buildingId: number) {
    return locationRepository.findUnitsByBuildingId(buildingId);
  },
  async validateUnitLocation(
    unitId: number,
    buildingId: number,
    communityId: number,
  ) {
    const unit = await locationRepository.findUnitWithLocation(unitId);

    if (!unit) {
      throw new Error("Unit not found");
    }

    if (
      unit.buildingId !== buildingId ||
      unit.building.id !== buildingId ||
      unit.building.communityId !== communityId
    ) {
      throw new Error("Invalid community, building, or unit selection");
    }

    return unit;
  },
};

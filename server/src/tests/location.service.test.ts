import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../modules/locations/location.repository.js", () => ({
  locationRepository: {
    findCommunities: vi.fn(),
    findBuildingsByCommunityId: vi.fn(),
    findUnitsByBuildingId: vi.fn(),
    findUnitWithLocation: vi.fn(),
  },
}));

vi.mock("../modules/users/user.repository.js", () => ({
  userRepository: {
    findById: vi.fn(),
  },
}));

import { locationService } from "../modules/locations/location.service.js";
import { locationRepository } from "../modules/locations/location.repository.js";
import { userRepository } from "../modules/users/user.repository.js";

describe("locationService - SEC-02", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should allow a resident to access their own community buildings", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 10,
      communityId: 2,
      unitId: 101,
      unit: {
        building: {
          communityId: 2,
        },
      },
    } as any);

    vi.mocked(
      locationRepository.findBuildingsByCommunityId,
    ).mockResolvedValue([
      {
        id: 20,
        name: "Building A",
        communityId: 2,
      },
    ]);

    const result = await locationService.getBuildingsByCommunityId(
      2,
      10,
      "RESIDENT",
    );

    expect(result).toHaveLength(1);
    expect(
      locationRepository.findBuildingsByCommunityId,
    ).toHaveBeenCalledWith(2);
  });

  it("should reject a resident accessing another community", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 10,
      communityId: 2,
      unitId: 101,
      unit: {
        building: {
          communityId: 2,
        },
      },
    } as any);

    await expect(
      locationService.getBuildingsByCommunityId(5, 10, "RESIDENT"),
    ).rejects.toThrow(
      "You are not authorized to access this community",
    );

    expect(
      locationRepository.findBuildingsByCommunityId,
    ).not.toHaveBeenCalled();
  });

  it("should allow a resident to access their own building units", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 10,
      communityId: 2,
      unitId: 101,
      unit: {
        building: {
          communityId: 2,
        },
      },
    } as any);

    vi.mocked(locationRepository.findUnitWithLocation).mockResolvedValue({
      id: 101,
      buildingId: 20,
      building: {
        id: 20,
        communityId: 2,
      },
    } as any);

    vi.mocked(
      locationRepository.findUnitsByBuildingId,
    ).mockResolvedValue([
      {
        id: 101,
        unitNumber: "A-101",
        buildingId: 20,
      },
    ]);

    const result = await locationService.getUnitsByBuildingId(
      20,
      10,
      "RESIDENT",
    );

    expect(result).toHaveLength(1);
    expect(
      locationRepository.findUnitsByBuildingId,
    ).toHaveBeenCalledWith(20);
  });

  it("should reject a resident accessing another building", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 10,
      communityId: 2,
      unitId: 101,
      unit: {
        building: {
          communityId: 2,
        },
      },
    } as any);

    vi.mocked(locationRepository.findUnitWithLocation).mockResolvedValue({
      id: 101,
      buildingId: 20,
      building: {
        id: 20,
        communityId: 2,
      },
    } as any);

    await expect(
      locationService.getUnitsByBuildingId(99, 10, "RESIDENT"),
    ).rejects.toThrow(
      "You are not authorized to access this building",
    );

    expect(
      locationRepository.findUnitsByBuildingId,
    ).not.toHaveBeenCalled();
  });
});
import { locationRepository } from "./location.repository.js";
import { userRepository } from "../users/user.repository.js";
import { AppError } from "../../utils/AppError.js";
import { prisma } from "../../lib/prisma.js";

export const locationService = {
  async getCommunities() {
    return locationRepository.findCommunities();
  },

  async getBuildingsByCommunityId(
    communityId: number,
    userId?: number,
    role?: string,
  ) {
    if ((role === "RESIDENT" || role === "MANAGER") && userId !== undefined) {
      const user = await userRepository.findById(userId);

      const userCommunityId =
        user?.communityId ?? user?.unit?.building?.communityId ?? null;

      if (!userCommunityId || userCommunityId !== communityId) {
        throw new AppError(
          "You are not authorized to access this community",
          403,
        );
      }
    }

    return locationRepository.findBuildingsByCommunityId(communityId);
  },

  async getUnitsByBuildingId(
    buildingId: number,
    userId?: number,
    role?: string,
  ) {
    if ((role === "RESIDENT" || role === "MANAGER") && userId !== undefined) {
      const user = await userRepository.findById(userId);

      if (role === "RESIDENT") {
        const userBuildingId = user?.unitId
          ? (await locationRepository.findUnitWithLocation(user.unitId))
              ?.buildingId
          : null;

        if (!userBuildingId || userBuildingId !== buildingId) {
          throw new AppError(
            "You are not authorized to access this building",
            403,
          );
        }
      }

      if (role === "MANAGER") {
        const managerCommunityId =
          user?.communityId ?? user?.unit?.building?.communityId ?? null;

        const building = await prisma.building.findUnique({
          where: { id: buildingId },
          select: {
            communityId: true,
          },
        });

        if (
          !managerCommunityId ||
          !building ||
          building.communityId !== managerCommunityId
        ) {
          throw new AppError(
            "You are not authorized to access this building",
            403,
          );
        }
      }
    }

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
  async createCommunity(data: { name: string; address: string }) {
    return locationRepository.createCommunity(data);
  },
  async createBuilding(data: { name: string; communityId: number }) {
    const community = await locationRepository.findCommunityById(
      data.communityId,
    );

    if (!community) {
      throw new AppError("Community not found", 404);
    }

    return locationRepository.createBuilding(data);
  },
  async createUnit(data: { unitNumber: string; buildingId: number }) {
    const building = await prisma.building.findUnique({
      where: { id: data.buildingId },
      select: { id: true },
    });

    if (!building) {
      throw new AppError("Building not found", 404);
    }

    return locationRepository.createUnit(data);
  },
  async getBuildingById(buildingId: number) {
    const building = await locationRepository.findBuildingById(buildingId);

    if (!building) {
      throw new AppError("Building not found", 404);
    }

    return building;
  },

  async getMyCommunity(userId: number, role?: string) {
    if (role !== "MANAGER") {
      throw new AppError("Access denied", 403);
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const communityId =
      user.communityId ?? user.unit?.building?.communityId ?? null;

    if (!communityId) {
      throw new AppError("You are not assigned to a community", 403);
    }

    const community = await locationRepository.findCommunityById(communityId);

    if (!community) {
      throw new AppError("Community not found", 404);
    }

    return community;
  },
};

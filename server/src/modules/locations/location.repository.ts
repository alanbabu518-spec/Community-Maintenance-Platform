import { prisma } from "../../lib/prisma.js";

export const locationRepository = {
  async findCommunities() {
    return prisma.community.findMany({
      select: {
        id: true,
        name: true,
        address: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  async findBuildingsByCommunityId(communityId: number) {
    return prisma.building.findMany({
      where: {
        communityId,
      },
      select: {
        id: true,
        name: true,
        communityId: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  async findUnitsByBuildingId(buildingId: number) {
    return prisma.unit.findMany({
      where: {
        buildingId,
      },
      select: {
        id: true,
        unitNumber: true,
        buildingId: true,
      },
      orderBy: {
        unitNumber: "asc",
      },
    });
  },
  async findUnitWithLocation(unitId: number) {
    return prisma.unit.findUnique({
      where: {
        id: unitId,
      },
      select: {
        id: true,
        buildingId: true,
        building: {
          select: {
            id: true,
            communityId: true,
          },
        },
      },
    });
  },
};

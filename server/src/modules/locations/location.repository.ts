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
  async createCommunity(data: { name: string; address: string }) {
    return prisma.community.create({
      data,
      select: {
        id: true,
        name: true,
        address: true,
      },
    });
  },
  async createBuilding(data: { name: string; communityId: number }) {
    return prisma.building.create({
      data,
      select: {
        id: true,
        name: true,
        communityId: true,
      },
    });
  },
  async findCommunityById(communityId: number) {
    return prisma.community.findUnique({
      where: {
        id: communityId,
      },
      select: {
        id: true,
        name: true,
        address: true,
      },
    });
  },
  async createUnit(data: { unitNumber: string; buildingId: number }) {
    return prisma.unit.create({
      data,
      select: {
        id: true,
        unitNumber: true,
        buildingId: true,
      },
    });
  },
  async findBuildingById(buildingId: number) {
    return prisma.building.findUnique({
      where: { id: buildingId },
      select: {
        id: true,
        name: true,
        communityId: true,
      },
    });
  },
};

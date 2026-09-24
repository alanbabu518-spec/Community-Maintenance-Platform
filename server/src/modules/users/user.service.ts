import bcrypt from "bcrypt";
import { userRepository } from "./user.repository.js";
import { toUserResponse } from "./user.mapper.js";
import type { UserFilters } from "./user.types.js";
import { AppError } from "../../utils/AppError.js";

export const userService = {
  async getUsers(filters: UserFilters) {
    const result = await userRepository.findAll(filters);

    const totalPages = Math.ceil(result.total / filters.limit);

    return {
      users: result.users.map(toUserResponse),
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: result.total,
        totalPages,
        hasNextPage: filters.page < totalPages,
        hasPreviousPage: filters.page > 1,
      },
    };
  },

  async createStaff(data: {
    name: string;
    email: string;
    password: string;
    role: "MANAGER" | "TECHNICIAN";
    communityId: number;
  }) {
    const community = await userRepository.findCommunityById(data.communityId);

    if (!community) {
      throw new AppError("Community not found", 404);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
      communityId: data.communityId,
    });

    return toUserResponse(user);
  },
  async updateActiveStatus(userId: number, isActive: boolean) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role === "ADMIN") {
      throw new AppError("Admin accounts cannot be deactivated", 400);
    }

    const updatedUser = await userRepository.updateActiveStatus(
      userId,
      isActive,
    );

    return toUserResponse(updatedUser);
  },
  async getTechnicians(userId: number) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role === "ADMIN") {
      return userRepository
        .findTechnicians()
        .then((technicians) => technicians.map(toUserResponse));
    }

    if (user.role === "MANAGER") {
      const communityId =
        user.communityId ?? user.unit?.building?.communityId ?? null;

      if (!communityId) {
        throw new AppError("You are not assigned to a community", 403);
      }

      const technicians = await userRepository.findTechnicians(communityId);

      return technicians.map(toUserResponse);
    }

    throw new AppError("Access denied", 403);
  },

  async getResidents(userId: number) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role === "ADMIN") {
      const result = await userRepository.findAll({
        page: 1,
        limit: 100,
        role: "RESIDENT",
        sortOrder: "desc",
      });

      return result.users.map(toUserResponse);
    }

    if (user.role === "MANAGER") {
      const communityId =
        user.communityId ?? user.unit?.building?.communityId ?? null;

      if (!communityId) {
        throw new AppError("You are not assigned to a community", 403);
      }

      const result = await userRepository.findAll({
        page: 1,
        limit: 100,
        role: "RESIDENT",
        communityId,
        sortOrder: "desc",
      });

      return result.users.map(toUserResponse);
    }

    throw new AppError("Access denied", 403);
  },
};

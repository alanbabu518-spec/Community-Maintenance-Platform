import bcrypt from "bcrypt";
import { userRepository } from "./user.repository.js";
import { toUserResponse } from "./user.mapper.js";
import type { UserFilters } from "./user.types.js";

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
  }) {
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
    });

    return toUserResponse(user);
  },
};

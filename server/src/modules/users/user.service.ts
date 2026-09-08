import { userRepository } from "./user.repository.js";
import { toUserResponse } from "./user.mapper.js";

export const userService = {
  async getUsers() {
    const users = await userRepository.findAll();

    return users.map(toUserResponse);
  },

  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: "RESIDENT" | "ADMIN" | "MANAGER" | "TECHNICIAN";
  }) {
    const user = await userRepository.create(data);

    return toUserResponse(user);
  },
};

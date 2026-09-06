import { userRepository } from "./user.repository.js";

export const userService = {
  getUsers() {
    return userRepository.findAll();
  },

  createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: "RESIDENT" | "ADMIN" | "MANAGER" | "TECHNICIAN";
  }) {
    return userRepository.create(data);
  },
};
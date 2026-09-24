import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../modules/users/user.repository.js", () => ({
  userRepository: {
    findCommunityById: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed-password"),
  },
}));

import { userService } from "../modules/users/user.service.js";
import { userRepository } from "../modules/users/user.repository.js";

describe("userService - SEC-10", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create staff with a valid community", async () => {
    vi.mocked(userRepository.findCommunityById).mockResolvedValue({
      id: 2,
    } as any);

    vi.mocked(userRepository.create).mockResolvedValue({
      id: 50,
      name: "Technician",
      email: "tech@example.com",
      role: "TECHNICIAN",
      communityId: 2,
    } as any);

    const result = await userService.createStaff({
      name: "Technician",
      email: "tech@example.com",
      password: "Password@123",
      role: "TECHNICIAN",
      communityId: 2,
    });

    expect(result.communityId).toBe(2);

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        role: "TECHNICIAN",
        communityId: 2,
      }),
    );
  });

  it("should reject staff creation when community does not exist", async () => {
    vi.mocked(userRepository.findCommunityById).mockResolvedValue(null);

    await expect(
      userService.createStaff({
        name: "Technician",
        email: "tech@example.com",
        password: "Password@123",
        role: "TECHNICIAN",
        communityId: 999,
      }),
    ).rejects.toThrow("Community not found");

    expect(userRepository.create).not.toHaveBeenCalled();
  });
});

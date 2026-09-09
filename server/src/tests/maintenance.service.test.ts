import { describe, expect, it, vi } from "vitest";
import { maintenanceService } from "../modules/maintenance/maintenance.service.js";
import { maintenanceRepository } from "../modules/maintenance/maintenance.repository.js";
import { userRepository } from "../modules/users/user.repository.js";

vi.mock("../modules/maintenance/maintenance.repository.js", () => ({
  maintenanceRepository: {
    findById: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("../modules/users/user.repository.js", () => ({
  userRepository: {
    findById: vi.fn(),
  },
}));

describe("maintenanceService.updateRequest", () => {
  it("should reject an invalid status transition", async () => {
    vi.mocked(maintenanceRepository.findById).mockResolvedValue({
      id: 17,
      title: "Test request",
      description: "Testing",
      category: "PLUMBING",
      priority: "HIGH",
      status: "OPEN",
      residentId: 32,
      unitId: 1,
      technicianId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    await expect(
      maintenanceService.updateRequest(17, {
        status: "ASSIGNED",
      }),
    ).rejects.toThrow("Invalid status transition");

    expect(maintenanceRepository.update).not.toHaveBeenCalled();
  });

  it("should allow a valid status transition", async () => {
    vi.mocked(maintenanceRepository.findById).mockResolvedValue({
      id: 17,
      title: "Test request",
      description: "Testing",
      category: "PLUMBING",
      priority: "HIGH",
      status: "OPEN",
      residentId: 32,
      unitId: 1,
      technicianId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    vi.mocked(maintenanceRepository.update).mockResolvedValue({
      id: 17,
      title: "Test request",
      description: "Testing",
      category: "PLUMBING",
      priority: "HIGH",
      status: "ACKNOWLEDGED",
      residentId: 32,
      unitId: 1,
      technicianId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    await maintenanceService.updateRequest(17, {
      status: "ACKNOWLEDGED",
    });

    expect(maintenanceRepository.update).toHaveBeenCalledWith(17, {
      status: "ACKNOWLEDGED",
    });
  });

  it("should allow the complete maintenance status workflow", async () => {
    const transitions = [
      ["OPEN", "ACKNOWLEDGED"],
      ["ACKNOWLEDGED", "ASSIGNED"],
      ["ASSIGNED", "IN_PROGRESS"],
      ["IN_PROGRESS", "RESOLVED"],
      ["RESOLVED", "CLOSED"],
    ] as const;

    for (const [currentStatus, nextStatus] of transitions) {
      vi.mocked(maintenanceRepository.findById).mockResolvedValue({
        id: 17,
        title: "Test request",
        description: "Testing",
        category: "PLUMBING",
        priority: "HIGH",
        status: currentStatus,
        residentId: 32,
        unitId: 1,
        technicianId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      vi.mocked(maintenanceRepository.update).mockResolvedValue({
        id: 17,
        title: "Test request",
        description: "Testing",
        category: "PLUMBING",
        priority: "HIGH",
        status: nextStatus,
        residentId: 32,
        unitId: 1,
        technicianId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      await maintenanceService.updateRequest(17, {
        status: nextStatus,
      });

      expect(maintenanceRepository.update).toHaveBeenCalledWith(17, {
        status: nextStatus,
      });
    }
  });

  it("should return null when maintenance request does not exist", async () => {
    vi.mocked(maintenanceRepository.findById).mockResolvedValue(null);

    const result = await maintenanceService.updateRequest(999, {
      status: "ACKNOWLEDGED",
    });

    expect(result).toBeNull();

    expect(maintenanceRepository.update).not.toHaveBeenCalled();
  });
});

describe("maintenanceService.assignTechnician", () => {
  it("should assign a technician to an acknowledged request", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 29,
      name: "Test Technician",
      email: "technician@test.com",
      passwordHash: "hashed-password",
      role: "TECHNICIAN",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    vi.mocked(maintenanceRepository.findById).mockResolvedValue({
      id: 17,
      title: "Test request",
      description: "Testing",
      category: "PLUMBING",
      priority: "HIGH",
      status: "ACKNOWLEDGED",
      residentId: 32,
      unitId: 1,
      technicianId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    vi.mocked(maintenanceRepository.update).mockResolvedValue({
      id: 17,
      title: "Test request",
      description: "Testing",
      category: "PLUMBING",
      priority: "HIGH",
      status: "ASSIGNED",
      residentId: 32,
      unitId: 1,
      technicianId: 29,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    await maintenanceService.assignTechnician(17, 29);

    expect(maintenanceRepository.update).toHaveBeenCalledWith(17, {
      technicianId: 29,
      status: "ASSIGNED",
    });
  });

  it("should reject assigning a non-technician user", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 30,
      name: "Regular Resident",
      email: "resident@test.com",
      passwordHash: "hashed-password",
      role: "RESIDENT",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    await expect(
      maintenanceService.assignTechnician(17, 30),
    ).rejects.toThrow("User is not a technician");

    expect(maintenanceRepository.update).not.toHaveBeenCalled();
  });

  it("should reject when technician does not exist", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null);

    await expect(
      maintenanceService.assignTechnician(17, 999),
    ).rejects.toThrow("Technician not found");

    expect(maintenanceRepository.findById).not.toHaveBeenCalled();
    expect(maintenanceRepository.update).not.toHaveBeenCalled();
  });
});
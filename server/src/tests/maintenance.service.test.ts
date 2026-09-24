import { describe, expect, it, vi } from "vitest";

vi.mock("../config/redis.js", () => ({
  redisClient: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    keys: vi.fn(),
  },
}));

vi.mock("../config/queue.js", () => ({
  notificationQueue: {
    add: vi.fn(),
  },
}));

vi.mock("../utils/cloudinaryUpload.js", () => ({
  uploadImage: vi.fn(),
}));

vi.mock("../modules/admin/admin.activity.service.js", () => ({
  logAdminActivity: vi.fn(),
}));

import { maintenanceService } from "../modules/maintenance/maintenance.service.js";
import { maintenanceRepository } from "../modules/maintenance/maintenance.repository.js";
import { userRepository } from "../modules/users/user.repository.js";

vi.mock("../modules/maintenance/maintenance.repository.js", () => ({
  maintenanceRepository: {
    findById: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    findAll: vi.fn(),
    countAll: vi.fn(),
    findCommunityManagersAndAdmins: vi.fn(),
  },
}));

vi.mock("../modules/users/user.repository.js", () => ({
  userRepository: {
    findById: vi.fn(),
  },
}));

describe("maintenanceService.createRequest", () => {
  it("should create a maintenance request for the resident's own unit", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 32,
      unitId: 1,
      role: "RESIDENT",
    } as any);

    vi.mocked(maintenanceRepository.create).mockResolvedValue({
      id: 17,
      title: "Water leakage",
      description: "Water is leaking",
      category: "PLUMBING",
      priority: "HIGH",
      status: "OPEN",
      residentId: 32,
      unitId: 1,
      technicianId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    vi.mocked(maintenanceRepository.findById).mockResolvedValue({
      id: 17,
      title: "Water leakage",
      description: "Testing",
      category: "PLUMBING",
      priority: "HIGH",
      status: "OPEN",
      residentId: 32,
      unitId: 1,
      technicianId: null,
      resident: {
        id: 32,
        name: "Test Resident",
        email: "resident@test.com",
        role: "RESIDENT",
      },
      unit: {
        building: {
          communityId: 1,
        },
      },
      technician: null,
      maintenanceAttachments: [],
    } as any);

    vi.mocked(
      maintenanceRepository.findCommunityManagersAndAdmins,
    ).mockResolvedValue([]);

    await maintenanceService.createRequest(
      {
        title: "Water leakage",
        description: "Water is leaking",
        category: "PLUMBING",
        priority: "HIGH",
        unitId: 1,
      } as any,
      32,
      [],
    );

    expect(maintenanceRepository.create).toHaveBeenCalledWith({
      title: "Water leakage",
      description: "Water is leaking",
      category: "PLUMBING",
      priority: "HIGH",
      unitId: 1,
      residentId: 32,
    });
  });

  it("should reject a resident creating a request for another unit", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 32,
      unitId: 1,
      role: "RESIDENT",
    } as any);

    await expect(
      maintenanceService.createRequest(
        {
          title: "Water leakage",
          description: "Water is leaking",
          category: "PLUMBING",
          priority: "HIGH",
          unitId: 2,
        } as any,
        32,
        [],
      ),
    ).rejects.toThrow(
      "You are not authorized to file requests for this unit",
    );

    expect(maintenanceRepository.create).not.toHaveBeenCalled();
  });

  it("should reject a resident without an assigned unit", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 32,
      unitId: null,
      role: "RESIDENT",
    } as any);

    await expect(
      maintenanceService.createRequest(
        {
          title: "Water leakage",
          description: "Water is leaking",
          category: "PLUMBING",
          priority: "HIGH",
          unitId: 1,
        } as any,
        32,
        [],
      ),
    ).rejects.toThrow(
      "You are not authorized to file requests for this unit",
    );

    expect(maintenanceRepository.create).not.toHaveBeenCalled();
  });
});

describe("maintenanceService.getRequests", () => {
  it("should restrict manager requests to their own community", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 10,
      role: "MANAGER",
      communityId: 1,
      unitId: null,
    } as any);

    vi.mocked(maintenanceRepository.findAll).mockResolvedValue([]);
    vi.mocked(maintenanceRepository.countAll).mockResolvedValue(0);

    const result = await maintenanceService.getRequests(
      10,
      "MANAGER",
      1,
      10,
      {},
    );

    expect(result).toEqual({
      requests: [],
      total: 0,
    });

    expect(maintenanceRepository.findAll).toHaveBeenCalledWith(
      0,
      10,
      {},
      1,
    );

    expect(maintenanceRepository.countAll).toHaveBeenCalledWith({}, 1);
  });
});

describe("maintenanceService.getRequestById", () => {
  it("should allow a manager to access a request in their own community", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 10,
      name: "Test Manager",
      email: "manager@test.com",
      role: "MANAGER",
      communityId: 1,
      unitId: null,
    } as any);

    vi.mocked(maintenanceRepository.findById).mockResolvedValue({
      id: 17,
      title: "Water leakage",
      description: "Testing",
      category: "PLUMBING",
      priority: "HIGH",
      status: "OPEN",
      residentId: 32,
      unitId: 1,
      technicianId: null,
      resident: {
        id: 32,
        name: "Test Resident",
        email: "resident@test.com",
        role: "RESIDENT",
      },
      unit: {
        building: {
          communityId: 1,
          community: {
            id: 1,
            name: "Test Community",
            address: "Test Address",
          },
        },
      },
      technician: null,
      maintenanceAttachments: [],
    } as any);

    const result = await maintenanceService.getRequestById(
      17,
      10,
      "MANAGER",
    );

    expect(result).toBeDefined();
  });

  it("should reject a manager accessing a request from another community", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 10,
      name: "Test Manager",
      email: "manager@test.com",
      role: "MANAGER",
      communityId: 1,
      unitId: null,
    } as any);

    vi.mocked(maintenanceRepository.findById).mockResolvedValue({
      id: 17,
      title: "Water leakage",
      description: "Testing",
      category: "PLUMBING",
      priority: "HIGH",
      status: "OPEN",
      residentId: 32,
      unitId: 2,
      technicianId: null,
      resident: {
        id: 32,
        name: "Test Resident",
        email: "resident@test.com",
        role: "RESIDENT",
      },
      unit: {
        building: {
          communityId: 2,
        },
      },
      technician: null,
      maintenanceAttachments: [],
    } as any);

    await expect(
      maintenanceService.getRequestById(
        17,
        10,
        "MANAGER",
      ),
    ).rejects.toThrow(
      "You are not authorized to access this maintenance request",
    );
  });
});

describe("maintenanceService.updateRequest", () => {
  it("should reject an invalid status transition", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 1,
      role: "MANAGER",
      communityId: 1,
      unitId: null,
    } as any);

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
      unit: {
        building: {
          communityId: 1,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    await expect(
      maintenanceService.updateRequest(
        17,
        {
          status: "ASSIGNED",
        },
        1,
        "MANAGER",
      ),
    ).rejects.toThrow("Invalid status transition");

    expect(maintenanceRepository.update).not.toHaveBeenCalled();
  });

  it("should allow a valid status transition", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 1,
      role: "MANAGER",
      communityId: 1,
      unitId: null,
    } as any);

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
      unit: {
        building: {
          communityId: 1,
        },
      },
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

    await maintenanceService.updateRequest(
      17,
      {
        status: "ACKNOWLEDGED",
      },
      1,
      "MANAGER",
    );

    expect(maintenanceRepository.update).toHaveBeenCalledWith(
      17,
      {
        status: "ACKNOWLEDGED",
      },
    );
  });

  it("should allow a manager to update a request in their own community", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 1,
      role: "MANAGER",
      communityId: 1,
      unitId: null,
    } as any);

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
      unit: {
        building: {
          communityId: 1,
        },
      },
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

    await maintenanceService.updateRequest(
      17,
      {
        status: "ACKNOWLEDGED",
      },
      1,
      "MANAGER",
    );

    expect(maintenanceRepository.update).toHaveBeenCalledWith(
      17,
      {
        status: "ACKNOWLEDGED",
      },
    );
  });

  it("should reject a manager updating a request from another community", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 1,
      role: "MANAGER",
      communityId: 1,
      unitId: null,
    } as any);

    vi.mocked(maintenanceRepository.findById).mockResolvedValue({
      id: 17,
      title: "Test request",
      description: "Testing",
      category: "PLUMBING",
      priority: "HIGH",
      status: "OPEN",
      residentId: 32,
      unitId: 2,
      technicianId: null,
      unit: {
        building: {
          communityId: 2,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    await expect(
      maintenanceService.updateRequest(
        17,
        {
          status: "ACKNOWLEDGED",
        },
        1,
        "MANAGER",
      ),
    ).rejects.toThrow(
      "You are not authorized to update this maintenance request",
    );

    expect(maintenanceRepository.update).not.toHaveBeenCalled();
  });

  it("should allow the complete maintenance status workflow", async () => {
    const transitions = [
      ["OPEN", "ACKNOWLEDGED"],
      ["ACKNOWLEDGED", "ASSIGNED"],
      ["ASSIGNED", "IN_PROGRESS"],
      ["IN_PROGRESS", "RESOLVED"],
      ["RESOLVED", "CLOSED"],
    ] as const;

    vi.mocked(userRepository.findById).mockResolvedValue({
      id: 1,
      role: "MANAGER",
      communityId: 1,
      unitId: null,
    } as any);

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
        unit: {
          building: {
            communityId: 1,
          },
        },
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

      await maintenanceService.updateRequest(
        17,
        {
          status: nextStatus,
        },
        1,
        "MANAGER",
      );

      expect(maintenanceRepository.update).toHaveBeenCalledWith(
        17,
        {
          status: nextStatus,
        },
      );
    }
  });

  it("should return null when maintenance request does not exist", async () => {
    vi.mocked(maintenanceRepository.findById).mockResolvedValue(null);

    const result = await maintenanceService.updateRequest(
      999,
      {
        status: "ACKNOWLEDGED",
      },
      1,
      "MANAGER",
    );

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

    expect(maintenanceRepository.update).toHaveBeenCalledWith(
      17,
      {
        technicianId: 29,
        status: "ASSIGNED",
      },
    );
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

  it("should allow a technician to update the status of their assigned request", async () => {
    vi.mocked(maintenanceRepository.findById).mockResolvedValue({
      id: 1,
      status: "ASSIGNED",
      technicianId: 10,
      residentId: 20,
      title: "Water leakage",
      unit: {
        building: {
          communityId: 2,
        },
      },
    } as any);

    vi.mocked(maintenanceRepository.update).mockResolvedValue({
      id: 1,
      status: "IN_PROGRESS",
      technicianId: 10,
      residentId: 20,
      title: "Water leakage",
    } as any);

    const result = await maintenanceService.updateRequest(
      1,
      {
        status: "IN_PROGRESS",
      },
      10,
      "TECHNICIAN",
    );

    expect(result).toBeDefined();

    expect(maintenanceRepository.update).toHaveBeenCalledWith(
      1,
      {
        status: "IN_PROGRESS",
      },
    );
  });

  it("should reject a technician modifying priority", async () => {
    vi.mocked(maintenanceRepository.findById).mockResolvedValue({
      id: 1,
      status: "ASSIGNED",
      technicianId: 10,
      residentId: 20,
      title: "Water leakage",
      unit: {
        building: {
          communityId: 2,
        },
      },
    } as any);

    await expect(
      maintenanceService.updateRequest(
        1,
        {
          priority: "URGENT",
        },
        10,
        "TECHNICIAN",
      ),
    ).rejects.toThrow(
      "Technicians are not authorized to modify priority or category",
    );

    expect(maintenanceRepository.update).not.toHaveBeenCalled();
  });

  it("should reject a technician modifying category", async () => {
    vi.mocked(maintenanceRepository.findById).mockResolvedValue({
      id: 1,
      status: "ASSIGNED",
      technicianId: 10,
      residentId: 20,
      title: "Water leakage",
      unit: {
        building: {
          communityId: 2,
        },
      },
    } as any);

    await expect(
      maintenanceService.updateRequest(
        1,
        {
          category: "Electrical",
        },
        10,
        "TECHNICIAN",
      ),
    ).rejects.toThrow(
      "Technicians are not authorized to modify priority or category",
    );

    expect(maintenanceRepository.update).not.toHaveBeenCalled();
  });
});
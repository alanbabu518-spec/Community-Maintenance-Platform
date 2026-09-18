import { describe, expect, it, vi } from "vitest";

vi.mock("../config/redis.js", () => ({
  redisClient: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    keys: vi.fn(),
  },
}));

import {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPattern,
} from "../utils/cache.js";
import { redisClient } from "../config/redis.js";

describe("cache utilities", () => {
  it("returns null when Redis get fails", async () => {
    vi.mocked(redisClient.get).mockRejectedValue(
      new Error("Redis unavailable"),
    );

    const result = await getCache("test:key");

    expect(result).toBeNull();
  });

  it("does not throw when Redis set fails", async () => {
    vi.mocked(redisClient.set).mockRejectedValue(
      new Error("Redis unavailable"),
    );

    await expect(
      setCache("test:key", { name: "Alan" }, 60),
    ).resolves.toBeUndefined();
  });

  it("sets a value in Redis with TTL", async () => {
    vi.mocked(redisClient.set).mockResolvedValue("OK");

    await setCache("test:key", { name: "Alan" }, 60);

    expect(redisClient.set).toHaveBeenCalledWith(
      "test:key",
      JSON.stringify({ name: "Alan" }),
      { EX: 60 },
    );
  });

  it("gets and parses a cached value", async () => {
    vi.mocked(redisClient.get).mockResolvedValue(
      JSON.stringify({ name: "Alan" }),
    );

    const result = await getCache<{ name: string }>("test:key");

    expect(result).toEqual({ name: "Alan" });
  });

  it("deletes a cache key", async () => {
    vi.mocked(redisClient.del).mockResolvedValue(1);

    await deleteCache("test:key");

    expect(redisClient.del).toHaveBeenCalledWith("test:key");
  });

  it("deletes cache keys matching a pattern", async () => {
    vi.mocked(redisClient.keys).mockResolvedValue([
      "maintenance:list:ADMIN:25:1:10",
      "maintenance:list:ADMIN:25:2:10",
    ]);

    vi.mocked(redisClient.del).mockResolvedValue(2);

    await deleteCacheByPattern("maintenance:list:*");

    expect(redisClient.keys).toHaveBeenCalledWith("maintenance:list:*");
    expect(redisClient.del).toHaveBeenCalledWith([
      "maintenance:list:ADMIN:25:1:10",
      "maintenance:list:ADMIN:25:2:10",
    ]);
  });
});
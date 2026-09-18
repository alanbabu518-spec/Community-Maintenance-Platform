import { redisClient } from "../config/redis.js";

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redisClient.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as T;
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
}

export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds: number,
) {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  } catch (error) {
    console.error("Redis set error:", error);
  }
}

export async function deleteCache(key: string) {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Redis delete error:", error);
  }
}

export async function deleteCacheByPattern(pattern: string) {
  try {
    let cursor = "0";

    do {
      const result = await redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });

      cursor = result.cursor;

      if (result.keys.length > 0) {
        await redisClient.del(result.keys);
      }
    } while (cursor !== "0");
  } catch (error) {
    console.error("Redis pattern delete error:", error);
  }
}

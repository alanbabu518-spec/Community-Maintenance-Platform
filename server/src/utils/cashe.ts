import { redisClient } from "../config/redis.js";

export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redisClient.get(key);

  if (!data) {
    return null;
  }

  return JSON.parse(data) as T;
}

export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds: number,
) {
  await redisClient.set(key, JSON.stringify(value), {
    EX: ttlSeconds,
  });
}

export async function deleteCache(key: string) {
  await redisClient.del(key);
}

export async function deleteCacheByPattern(pattern: string) {
  const keys = await redisClient.keys(pattern);

  if (keys.length > 0) {
    await redisClient.del(keys);
  }
}
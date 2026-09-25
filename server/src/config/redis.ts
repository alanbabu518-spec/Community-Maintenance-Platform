import { createClient } from "redis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("connect", () => {
  console.log("Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("Redis ready");
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error);
});

let redisConnectionPromise: Promise<void> | null = null;

export async function connectRedis() {
  if (redisClient.isReady) {
    return;
  }

  if (!redisConnectionPromise) {
    redisConnectionPromise = (async () => {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }

      if (!redisClient.isReady) {
        throw new Error("Redis connection was not ready");
      }

      console.log("Redis connected successfully!");
    })().catch((error) => {
      redisConnectionPromise = null;
      throw error;
    });
  }

  await redisConnectionPromise;
}

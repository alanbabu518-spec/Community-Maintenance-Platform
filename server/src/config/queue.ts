import { Queue } from "bullmq";
import { Redis } from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

const queueRedisClient = new Redis(process.env.REDIS_URL);

export const notificationQueue = new Queue("notification", {
  connection: queueRedisClient,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});
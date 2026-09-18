import { Worker } from "bullmq";
import { Redis } from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

const workerRedisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const notificationWorker = new Worker(
  "notification",
  async (job) => {
    console.log(
      `Processing notification job ${job.id}, attempt ${job.attemptsMade + 1}`,
    );

    console.log("Notification data:", job.data);
  },
  {
    connection: workerRedisClient,
  },
);

notificationWorker.on("completed", (job) => {
  console.log(`Notification job ${job.id} completed`);
});

notificationWorker.on("failed", (job, error) => {
  console.error(`Notification job ${job?.id} failed:`, error);
});

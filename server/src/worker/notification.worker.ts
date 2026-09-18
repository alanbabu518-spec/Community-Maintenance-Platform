import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { createUserNotification } from "../modules/notifications/notification.service.js";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

const workerRedisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const notificationWorker = new Worker(
  "notification",
  async (job) => {
    await createUserNotification({
      userId: job.data.residentId,
      type: "MAINTENANCE_CREATED",
      title: job.data.title,
      message: job.data.message,
    });
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

import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { createUserNotification } from "../modules/notifications/notification.service.js";
import { emitToUser } from "../config/socket.js";
import { sendPushNotification } from "../modules/notifications/push.sender.js";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

const workerRedisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const notificationWorker = new Worker(
  "notification",
  async (job) => {
    const notification = await createUserNotification({
      userId: job.data.residentId,
      type: "MAINTENANCE_CREATED",
      title: job.data.title,
      message: job.data.message,
    });

    await sendPushNotification(job.data.residentId, {
      title: job.data.title,
      message: job.data.message,
    });

    emitToUser(job.data.residentId, "notification:new", notification);
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

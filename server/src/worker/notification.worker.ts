import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { createUserNotification } from "../modules/notifications/notification.service.js";
import { emitToUser } from "../config/socket.js";
import { sendPushNotification } from "../modules/notifications/push.sender.js";
import { prisma } from "../lib/prisma.js";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

const workerRedisClient = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const notificationWorker = new Worker(
  "notification",
  async (job) => {
    if (job.name === "maintenance-created") {
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

      return;
    }

    if (job.name === "announcement-created") {
      const users = await prisma.user.findMany({
        where: {
          unit: {
            building: {
              communityId: job.data.communityId,
            },
          },
        },
        select: {
          id: true,
        },
      });

      for (const user of users) {
        try {
          await sendPushNotification(user.id, {
            title: job.data.title,
            message: job.data.message,
          });
        } catch (error) {
          console.error(`Push notification failed for user ${user.id}:`, error);
        }
      }
      return;
    }

    throw new Error(`Unknown notification job: ${job.name}`);
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

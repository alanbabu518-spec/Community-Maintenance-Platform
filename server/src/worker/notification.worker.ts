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
    if (job.name === "maintenance-notification") {
      const notification = await createUserNotification({
        userId: job.data.userId,
        type: job.data.type,
        title: job.data.title,
        message: job.data.message,
      });

      const preferences = await prisma.notificationPreference.findUnique({
        where: {
          userId: job.data.userId,
        },
      });

      if (
        preferences?.pushEnabled !== false &&
        preferences?.maintenance !== false
      ) {
        try {
          await sendPushNotification(job.data.userId, {
            title: job.data.title,
            message: job.data.message,
          });
        } catch (error) {
          console.error(
            `Push notification failed for user ${job.data.userId}:`,
            error,
          );
        }
      }

      emitToUser(job.data.userId, "notification:new", notification);

      return notification;
    }

    if (job.name === "maintenance-created") {
      const notification = await createUserNotification({
        userId: job.data.residentId,
        type: "MAINTENANCE_CREATED",
        title: job.data.title,
        message: job.data.message,
      });

      const preferences = await prisma.notificationPreference.findUnique({
        where: {
          userId: job.data.residentId,
        },
      });

      if (
        preferences?.pushEnabled !== false &&
        preferences?.maintenance !== false
      ) {
        try {
          await sendPushNotification(job.data.residentId, {
            title: job.data.title,
            message: job.data.message,
          });
        } catch (error) {
          console.error(
            `Push notification failed for user ${job.data.residentId}:`,
            error,
          );
        }
      }

      emitToUser(job.data.residentId, "notification:new", notification);

      return notification;
    }

    if (job.name === "announcement-created") {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            {
              communityId: job.data.communityId,
            },
            {
              unit: {
                building: {
                  communityId: job.data.communityId,
                },
              },
            },
          ],
        },
        select: {
          id: true,
        },
      });

      for (const user of users) {
        const notification = await createUserNotification({
          userId: user.id,
          type: "ANNOUNCEMENT_CREATED",
          title: job.data.title,
          message: job.data.message,
        });

        const preferences = await prisma.notificationPreference.findUnique({
          where: {
            userId: user.id,
          },
        });

        if (
          preferences?.pushEnabled !== false &&
          preferences?.announcements !== false
        ) {
          try {
            await sendPushNotification(user.id, {
              title: job.data.title,
              message: job.data.message,
            });
          } catch (error) {
            console.error(
              `Push notification failed for user ${user.id}:`,
              error,
            );
          }
        }

        emitToUser(user.id, "notification:new", notification);
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
  console.log(
    `[Notification Worker] Job completed | id=${job.id} | name=${job.name}`,
  );
});

notificationWorker.on("failed", (job, error) => {
  console.error(
    `[Notification Worker] Job failed | id=${job?.id} | name=${job?.name} | attempts=${job?.attemptsMade}`,
    error,
  );
});

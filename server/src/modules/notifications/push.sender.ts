import webpush from "../../config/webPush.js";
import { prisma } from "../../lib/prisma.js";

export async function sendPushNotification(
  userId: number,
  payload: {
    title: string;
    message: string;
  },
) {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  const notificationPayload = JSON.stringify(payload);

  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        notificationPayload,
      );
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "statusCode" in error &&
        (error.statusCode === 404 || error.statusCode === 410)
      ) {
        await prisma.pushSubscription.delete({
          where: { id: subscription.id },
        });

        continue;
      }

      throw error;
    }
  }
}

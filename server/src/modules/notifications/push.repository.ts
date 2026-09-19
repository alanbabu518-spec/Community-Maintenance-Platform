import { prisma } from "../../lib/prisma.js";

export async function savePushSubscription(data: {
  userId: number;
  endpoint: string;
  p256dh: string;
  auth: string;
}) {
  return prisma.pushSubscription.upsert({
    where: {
      endpoint: data.endpoint,
    },
    update: {
      userId: data.userId,
      p256dh: data.p256dh,
      auth: data.auth,
    },
    create: data,
  });
}
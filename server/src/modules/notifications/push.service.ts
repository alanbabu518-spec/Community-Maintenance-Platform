import { savePushSubscription } from "./push.repository.js";

export async function subscribeUserToPush(data: {
  userId: number;
  endpoint: string;
  p256dh: string;
  auth: string;
}) {
  return savePushSubscription(data);
}
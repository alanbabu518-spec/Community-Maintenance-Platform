import { savePushSubscription } from "./push.repository.js";

function validatePushEndpoint(endpoint: string) {
  let url: URL;

  try {
    url = new URL(endpoint);
  } catch {
    throw new Error("Invalid push subscription endpoint");
  }

  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.hash
  ) {
    throw new Error("Invalid push subscription endpoint");
  }
}

export async function subscribeUserToPush(data: {
  userId: number;
  endpoint: string;
  p256dh: string;
  auth: string;
}) {
  validatePushEndpoint(data.endpoint);

  return savePushSubscription(data);
}
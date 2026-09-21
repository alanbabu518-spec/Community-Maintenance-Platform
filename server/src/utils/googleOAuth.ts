import crypto from "crypto";
import { redisClient } from "../config/redis.js";

const GOOGLE_STATE_EXPIRY_SECONDS = 10 * 60;

export type GoogleOAuthIntent = "login" | "register";

interface GoogleOAuthState {
  intent: GoogleOAuthIntent;
}

export function generateGoogleState(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function storeGoogleState(
  state: string,
  intent: GoogleOAuthIntent,
): Promise<void> {
  const data: GoogleOAuthState = {
    intent,
  };

  await redisClient.set(
    `google-oauth-state:${state}`,
    JSON.stringify(data),
    {
      EX: GOOGLE_STATE_EXPIRY_SECONDS,
    },
  );
}

export async function verifyAndDeleteGoogleState(
  state: string,
): Promise<GoogleOAuthIntent | null> {
  const key = `google-oauth-state:${state}`;

  const stored = await redisClient.get(key);

  if (!stored) {
    return null;
  }

  await redisClient.del(key);

  try {
    const data = JSON.parse(stored) as GoogleOAuthState;

    if (data.intent !== "login" && data.intent !== "register") {
      return null;
    }

    return data.intent;
  } catch {
    return null;
  }
}
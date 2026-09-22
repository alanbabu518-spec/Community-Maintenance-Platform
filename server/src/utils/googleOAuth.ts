import crypto from "crypto";
import { redisClient } from "../config/redis.js";

const GOOGLE_STATE_EXPIRY_SECONDS = 10 * 60;
const GOOGLE_REGISTRATION_EXPIRY_SECONDS = 10 * 60;

export type GoogleOAuthIntent = "login" | "register";

interface GoogleOAuthState {
  intent: GoogleOAuthIntent;
}

export interface PendingGoogleRegistration {
  googleId: string;
  email: string;
  name: string;
  picture: string | null;
  emailVerified: boolean;
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

  await redisClient.set(`google-oauth-state:${state}`, JSON.stringify(data), {
    EX: GOOGLE_STATE_EXPIRY_SECONDS,
  });
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

export function generateGoogleRegistrationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function storePendingGoogleRegistration(
  token: string,
  data: PendingGoogleRegistration,
): Promise<void> {
  await redisClient.set(`google-registration:${token}`, JSON.stringify(data), {
    EX: GOOGLE_REGISTRATION_EXPIRY_SECONDS,
  });
}

export async function getPendingGoogleRegistration(
  token: string,
): Promise<PendingGoogleRegistration | null> {
  const key = `google-registration:${token}`;

  const stored = await redisClient.get(key);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as PendingGoogleRegistration;
  } catch {
    return null;
  }
}

export async function deletePendingGoogleRegistration(
  token: string,
): Promise<void> {
  await redisClient.del(`google-registration:${token}`);
}

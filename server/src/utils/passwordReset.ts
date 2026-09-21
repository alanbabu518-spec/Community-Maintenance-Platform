import { randomBytes } from "crypto";
import { redisClient } from "../config/redis.js";

const RESET_TOKEN_EXPIRY_SECONDS = 15 * 60;

export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

export async function storeResetToken(
  userId: number,
  token: string,
) {
  const key = `password-reset:${token}`;

  await redisClient.set(key, userId.toString(), {
    EX: RESET_TOKEN_EXPIRY_SECONDS,
  });
}

export async function getResetTokenUserId(token: string) {
  const key = `password-reset:${token}`;

  const userId = await redisClient.get(key);

  return userId ? Number(userId) : null;
}

export async function deleteResetToken(token: string) {
  const key = `password-reset:${token}`;

  await redisClient.del(key);
}
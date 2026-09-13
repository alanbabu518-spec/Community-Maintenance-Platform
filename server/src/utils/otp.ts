import { redisClient } from "../config/redis.js";

const OTP_EXPIRY_SECONDS = 5 * 60;

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOtp(userId: number, otp: string) {
  const key = `otp:user:${userId}`;

  await redisClient.set(key, otp, {
    EX: OTP_EXPIRY_SECONDS,
  });
}

export async function getOtp(userId: number) {
  const key = `otp:user:${userId}`;

  return redisClient.get(key);
}

export async function deleteOtp(userId: number) {
  const key = `otp:user:${userId}`;

  await redisClient.del(key);
}

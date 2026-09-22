import { randomInt } from "crypto";
import { redisClient } from "../config/redis.js";

const OTP_EXPIRY_SECONDS = 5 * 60;
const MAX_OTP_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;

function getKey(email: string) {
  return `otp:${email}`;
}

function getAttemptsKey(email: string) {
  return `otp-attempts:${email}`;
}

function getCooldownKey(email: string) {
  return `otp-resend-cooldown:${email}`;
}

export function generateOtp() {
  return randomInt(100000, 1000000).toString();
}

export async function storeOtp(email: string, otp: string) {
  await redisClient.set(getKey(email), otp, {
    EX: OTP_EXPIRY_SECONDS,
  });

  await redisClient.set(getAttemptsKey(email), "0", {
    EX: OTP_EXPIRY_SECONDS,
  });
}

export async function getOtp(email: string) {
  return redisClient.get(getKey(email));
}

export async function getOtpAttempts(email: string) {
  const attempts = await redisClient.get(getAttemptsKey(email));

  return attempts ? Number(attempts) : 0;
}

export async function incrementOtpAttempts(email: string) {
  return redisClient.incr(getAttemptsKey(email));
}

export async function isOtpResendAllowed(email: string) {
  const exists = await redisClient.exists(getCooldownKey(email));

  return exists === 0;
}

export async function startOtpResendCooldown(email: string) {
  await redisClient.set(getCooldownKey(email), "1", {
    EX: OTP_RESEND_COOLDOWN_SECONDS,
  });
}

export async function deleteOtp(email: string) {
  await redisClient.del(getKey(email));
  await redisClient.del(getAttemptsKey(email));
  await redisClient.del(getCooldownKey(email));
}

export { MAX_OTP_ATTEMPTS };
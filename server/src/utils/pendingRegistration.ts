import { redisClient } from "../config/redis.js";

const PENDING_REGISTRATION_EXPIRY_SECONDS = 10 * 60;

export type PendingRegistration = {
  name: string;
  email: string;
  passwordHash: string;
  unitId: number;
};

function getKey(email: string) {
  return `pending-registration:${email}`;
}

export async function storePendingRegistration(data: PendingRegistration) {
  await redisClient.set(getKey(data.email), JSON.stringify(data), {
    EX: PENDING_REGISTRATION_EXPIRY_SECONDS,
  });
}

export async function getPendingRegistration(email: string) {
  const data = await redisClient.get(getKey(email));

  if (!data) {
    return null;
  }

  return JSON.parse(data) as PendingRegistration;
}

export async function deletePendingRegistration(email: string) {
  await redisClient.del(getKey(email));
}

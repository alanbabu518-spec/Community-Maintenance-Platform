import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../config/redis.js";

const redisStore =
  process.env.NODE_ENV === "production"
    ? new RedisStore({
        sendCommand: async (...args: string[]) => {
          console.log(`[RateLimit] Redis command: ${args[0]}`);

          console.log(
            `[RateLimit] Redis status - isOpen: ${redisClient.isOpen}, isReady: ${redisClient.isReady}`,
          );

          if (!redisClient.isReady) {
            console.error("[RateLimit] Redis is not ready");
            throw new Error("Redis is not ready");
          }

          return redisClient.sendCommand(args);
        },
      })
    : undefined;

export const authRateLimiter = rateLimit({
  ...(redisStore ? { store: redisStore } : {}),

  windowMs: 15 * 60 * 1000,

  limit: 10,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many authentication requests. Please try again later.",
  },
});

export const otpRateLimiter = rateLimit({
  ...(redisStore ? { store: redisStore } : {}),

  windowMs: 10 * 60 * 1000,

  limit: 5,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many OTP requests. Please try again later.",
  },
});

export const passwordResetRateLimiter = rateLimit({
  ...(redisStore ? { store: redisStore } : {}),

  windowMs: 15 * 60 * 1000,

  limit: 5,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many password reset requests. Please try again later.",
  },
});
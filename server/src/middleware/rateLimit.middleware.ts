import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../config/redis.js";

const createRedisStore = (prefix: string) =>
  new RedisStore({
    prefix,
    sendCommand: async (...args: string[]) => {
      console.log(`[RateLimit:${prefix}] Redis command: ${args[0]}`);

      if (!redisClient.isReady) {
        console.error(
          `[RateLimit:${prefix}] Redis is not ready`,
        );

        throw new Error("Redis is not ready");
      }

      return redisClient.sendCommand(args);
    },
  });

export const authRateLimiter = rateLimit({
  ...(process.env.NODE_ENV === "production"
    ? {
        store: createRedisStore("rl:auth:"),
      }
    : {}),

  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many authentication requests. Please try again later.",
  },
});

export const otpRateLimiter = rateLimit({
  ...(process.env.NODE_ENV === "production"
    ? {
        store: createRedisStore("rl:otp:"),
      }
    : {}),

  windowMs: 10 * 60 * 1000,
  limit: 5,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many OTP requests. Please try again later.",
  },
});

export const passwordResetRateLimiter = rateLimit({
  ...(process.env.NODE_ENV === "production"
    ? {
        store: createRedisStore("rl:password-reset:"),
      }
    : {}),

  windowMs: 15 * 60 * 1000,
  limit: 5,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many password reset requests. Please try again later.",
  },
});
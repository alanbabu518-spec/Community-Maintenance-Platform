import app from "./app.js";
import { connectRedis, redisClient } from "./config/redis.js";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { initializeSocket } from "./config/socket.js";
import { prisma } from "./lib/prisma.js";

const PORT = Number(process.env.PORT) || 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Initialize Socket.IO before starting the notification worker.
initializeSocket(io);

io.on("connection", async (socket) => {
  const token = socket.handshake.headers.cookie
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith("access_token="))
    ?.split("=")[1];

  if (!token) {
    socket.disconnect();
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as Express.AuthenticatedUser;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        tokenVersion: true,
        unit: {
          select: {
            building: {
              select: {
                communityId: true,
              },
            },
          },
        },
      },
    });

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      socket.disconnect();
      return;
    }

    socket.join(`user:${decoded.userId}`);

    const communityId = user.unit?.building?.communityId;

    if (communityId) {
      socket.join(`community:${communityId}`);
    }

    console.log(`Socket connected: ${socket.id}`);
  } catch (error) {
    console.error("Socket authentication error:", error);
    socket.disconnect();
  }

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Keep a reference so the worker can be stopped during shutdown.
let notificationWorker:
  | (typeof import("./worker/notification.worker.js"))["notificationWorker"]
  | undefined;

let isShuttingDown = false;

async function startServer() {
  try {
    // Connect to Redis.
    await connectRedis();
    console.log("Redis ready");

    // Connect to PostgreSQL.
    await prisma.$connect();
    console.log("PostgreSQL ready");

    // Start the notification worker only after dependencies
    // are ready and Socket.IO has been initialized.
    const workerModule = await import("./worker/notification.worker.js");

    notificationWorker = workerModule.notificationWorker;

    console.log("Notification worker started");

    // Start the HTTP server.
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    await shutdown("STARTUP_FAILURE", 1);
  }
}

async function shutdown(signal: string, exitCode = 0) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`${signal} received. Shutting down...`);

  try {
    // Stop accepting HTTP requests if the server has started.
    if (httpServer.listening) {
      await new Promise<void>((resolve, reject) => {
        httpServer.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      console.log("HTTP server closed");
    }

    // Stop processing notification jobs.
    if (notificationWorker) {
      await notificationWorker.close();
      notificationWorker = undefined;
      console.log("Notification worker closed");
    }

    // Close the backend Redis connection.
    if (redisClient.isOpen) {
      await redisClient.quit();
      console.log("Redis connection closed");
    }

    // Close the PostgreSQL connection.
    await prisma.$disconnect();
    console.log("PostgreSQL connection closed");

    process.exit(exitCode);
  } catch (error) {
    console.error("Shutdown error:", error);
    process.exit(1);
  }
}

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

void startServer();

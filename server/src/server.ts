import app from "./app.js";
import { connectRedis } from "./config/redis.js";
import "./worker/notification.worker.js";
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
    console.log(`Joined room: user:${decoded.userId}`);

    const communityId = user?.unit?.building?.communityId;

    if (communityId) {
      socket.join(`community:${communityId}`);
      console.log(`Joined room: community:${communityId}`);
    }

    console.log(`Socket connected: ${socket.id}`);
  } catch {
    socket.disconnect();
  }

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

async function startServer() {
  try {
    await connectRedis();

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Redis unavailable:", error);
    process.exit(1);
  }
}

startServer();

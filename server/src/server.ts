import app from "./app.js";
import { connectRedis } from "./config/redis.js";
import "./worker/notification.worker.js";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { initializeSocket } from "./config/socket.js";

const PORT = 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

initializeSocket(io);

io.on("connection", (socket) => {
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

    socket.join(`user:${decoded.userId}`);
    console.log(`Joined room: user:${decoded.userId}`);

    console.log(`Socket connected: ${socket.id}`);
  } catch {
    socket.disconnect();
  }

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectRedis().catch(() => {
  console.error("Redis unavailable. Continuing without Redis.");
});

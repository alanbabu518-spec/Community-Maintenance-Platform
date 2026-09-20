import { Server } from "socket.io";

let io: Server;

export function initializeSocket(server: Server) {
  io = server;
}

export function emitToUser(
  userId: number,
  event: string,
  data: unknown,
) {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }

  const room = io.sockets.adapter.rooms.get(`user:${userId}`);

  console.log(`Emitting ${event} to user:${userId}`);
  console.log(`Connected sockets in room: ${room?.size ?? 0}`);

  io.to(`user:${userId}`).emit(event, data);
}

export function emitToCommunity(
  communityId: number,
  event: string,
  data: unknown,
) {
  if (!io) {
    throw new Error("Socket.IO is not initialized");
  }

  io.to(`community:${communityId}`).emit(event, data);
}
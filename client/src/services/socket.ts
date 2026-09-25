import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const SOCKET_URL = new URL(API_URL).origin;

console.log("VITE_API_BASE_URL:", API_URL);
console.log("SOCKET_URL:", SOCKET_URL);

export const socket = io(SOCKET_URL, {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

socket.on("notification:new", (notification) => {
  console.log("New notification:", notification);

  window.dispatchEvent(
    new CustomEvent("notification:new", {
      detail: notification,
    }),
  );
});

socket.on("announcement:new", (announcement) => {
  console.log("New announcement:", announcement);

  window.dispatchEvent(
    new CustomEvent("announcement:new", {
      detail: announcement,
    }),
  );
});
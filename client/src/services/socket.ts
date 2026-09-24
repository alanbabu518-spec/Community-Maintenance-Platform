import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api", "");

export const socket = io(SOCKET_URL, {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
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

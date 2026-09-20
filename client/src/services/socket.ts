import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
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

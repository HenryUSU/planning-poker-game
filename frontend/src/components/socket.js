import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BACKEND_URL ?? window.origin, {
  path: "/api/session/",
  reconnection: true,
  reconnectionAttempts: 5,
  timeout: 10000,
});

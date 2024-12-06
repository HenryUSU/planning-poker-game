import { io } from "socket.io-client";

export const socket = io(`${window.origin}`, {
  path: "/api/session/",
});

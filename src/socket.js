import { io } from "socket.io-client";

const API = "https://hospitalmgt-backend.onrender.com";

const socket = io(API, {
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;

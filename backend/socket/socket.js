import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://chat-app-frontend-w3p3-pa0jm1tea-charithas-projects-88154584.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ✅ Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Backend is healthy 🚀" });
});

// Store user/socket mapping
const userSocketMap = {};

// Utility to get a user's socket ID
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, io, server };

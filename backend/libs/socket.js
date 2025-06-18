const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO Server
const io = new Server(server, {
  cors: {
    origin: [process.env.BASE_URL],
  },
});


const userSocketMap = {}; // {userId: socketId}
function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Connect จาก Frontend
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("Updated userSocketMap:", userSocketMap);
    console.log("User connected:", userId, socket.id);
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Disconnect ตัว Socket
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
  });
});

module.exports = {
  io,
  app,
  server,
  getReceiverSocketId,
};

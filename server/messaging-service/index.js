// server.js (or index.js)
const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const messagingSocket = require("./socket/messagingSocket.js");
const redis = require("redis");

// Configure Redis client
const client = redis.createClient();
client.on("error", (error) => {
  console.error("Redis client error:", error);
});

// client.auth("your-redis-password"); // If needed

// Initialize Express, Socket.IO, and Redis
app.use(express.json());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.1.102:3000"],
    methods: ["GET", "POST"],
  },
});

messagingSocket.initializeSocket(io, client); // Pass Redis client to socket module

const PORT = process.env.PORT || 3006;
server.listen(PORT, () => {
  console.log(`Messaging service running on port ${PORT}`);
});

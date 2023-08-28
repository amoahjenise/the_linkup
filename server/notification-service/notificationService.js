const socketIo = require("socket.io");
const userSockets = require("./userSockets");

const initSocketServer = (httpServer) => {
  const io = socketIo(httpServer, {
    cors: {
      origin: "http://192.168.1.102:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected to the notification socket");

    socket.on("store-user-id", (userId) => {
      userSockets[userId] = socket;
      console.log(`Stored socket for user ID: ${userId}`);
    });

    socket.on("new-linkup-request", (data) => {
      console.log("Requester:", data.requesterName);
      console.log("userSockets:", data.creatorId);
      if (userSockets[data.creatorId]) {
        console.log("userSockets:", userSockets);
        userSockets[data.creatorId].emit("notification", {
          type: "linkup_request",
          content: `New linkup request from ${data.requesterName}`,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected from the notification socket");
    });
  });

  console.log("Notification socket server initialized");
};

module.exports = { initSocketServer };

const socketIo = require("socket.io");
const userSockets = require("../userSockets");

const ALLOWED_ORIGINS = [
  process.env.ALLOWED_ORIGIN || "https://c279-76-65-81-166.ngrok-free.app",
  "http://localhost:3000",
];

const initSocketServer = (httpServer) => {
  console.log("Notification socket server initialized");

  const io = socketIo(httpServer, {
    cors: {
      origin: ALLOWED_ORIGINS,
      methods: ["GET", "POST"],
    },
  });

  io.on("connect", (socket) => {
    console.log(`Socket ID: ${socket.id}`);
    // console.log(`Socket session user ID: ${socket.request.session.user.id}`);
  });

  //   io.on("connect", (socket) => {
  //     console.log("A user connected to the notification socket");
  //     socket.on("store-user-id", (userId) => {
  //       userSockets[userId] = socket;
  //       console.log(`Stored socket for user ID: ${userId}`);
  //       console.log(`Socket ID: ${socket.id}`);
  //     });

  //     socket.on("new-linkup-request", (data) => {
  //       console.log("Requester:", data.requesterName);
  //       console.log("userSockets:", data.creatorId);
  //       if (userSockets[data.creatorId]) {
  //         console.log("userSockets:", userSockets);
  //         userSockets[data.creatorId].emit("notification", {
  //           type: "linkup_request",
  //           content: `New linkup request from ${data.requesterName}`,
  //         });
  //       }
  //     });

  //     socket.on("disconnect", () => {
  //       console.log("A user disconnected from the notification socket");
  //     });
  //   });
};

module.exports = { initSocketServer };

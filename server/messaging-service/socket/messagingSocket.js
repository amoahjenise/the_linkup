const socketIo = require("socket.io");

const userSockets = {}; // Initialize an object to manage user sockets

const getSocketByUserId = (userId) => {
  return userSockets[userId];
};

const initializeSocket = (server) => {
  const messagingController = require("../controllers/messagingController");

  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["POST", "GET", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected to the messaging socket:", socket.id);

    // Handle user authentication and store sockets in userSockets object
    socket.on("authenticate", (userId) => {
      console.log("User authenticated:", userId);
      userSockets[userId] = socket;
      socket.userId = userId; // Store the user ID on the socket for reference
      console.log(socket.id);
    });

    // Handle disconnect and remove the socket from the userSockets object
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      // Remove the socket from userSockets
      delete userSockets[socket.userId];
    });

    // Handle message events
    socket.on("send-message", async (data) => {
      // Handle sending messages here
      try {
        await messagingController.sendMessage(data);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });
  });

  return io; // Export the io instance
};

module.exports = {
  initializeSocket,
  getSocketByUserId,
};

const socketIo = require("socket.io");

const userSockets = {}; // Initialize an object to manage user sockets

const getSocketByUserId = (userId) => {
  return userSockets[userId];
};

const initializeSocket = (server) => {
  const messagingController = require("../controllers/messagingController");

  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["POST", "GET", "PATCH", "DELETE"],
    },
  });

  messagingController.initializeSocket(io);

  io.on("connection", (socket) => {
    console.log("A user connected to the messaging socket:", socket.id);

    // Handle user authentication and store sockets in userSockets object
    socket.on("authenticate", (userId) => {
      const existingSocket = getSocketByUserId(userId);

      if (existingSocket) {
        // Disconnect the existing socket and replace it with the new one
        console.log("User re-authenticated:", userId);
        existingSocket.disconnect();
      }

      socket.join(`user-${userId}`);
      console.log("User authenticated:", userId);
      userSockets[userId] = socket;
      socket.userId = userId; // Store the user ID on the socket for reference
      console.log(socket.id);
    });

    // Handle disconnect and remove the socket from the userSockets object
    socket.on("disconnect", () => {
      console.log("A user disconnected from the messaging socket:", socket.id);
      // Remove the socket from userSockets
      if (socket.userId) {
        delete userSockets[socket.userId];
      }
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

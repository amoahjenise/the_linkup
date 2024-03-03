// linkupSocket.js (in link-up-management-service)
const socketIo = require("socket.io");

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["POST", "GET", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    // Get the user ID or any unique identifier for the user
    const userId = socket.handshake.query.userId;

    // Assign the user's socket ID as the unique identifier
    socket.userId = userId;

    socket.join(`user-${userId}`);

    console.log(
      "A user connected to the linkup service socket:",
      JSON.stringify(socket.handshake.query)
    );

    // Listen for "join-linkup-room" events
    socket.on("join-linkup-room", (linkupId) => {
      console.log("join-linkup-room", linkupId);
      // Create a room for the linkup (if not already created) and add the creator to it
      socket.join(`linkup-${linkupId}`);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected to the linkup service socket");
    });

    // Handle Socket.IO errors
    socket.on("error", (error) => {
      console.error("Socket.IO Error:", error);
    });
  });

  return io; // Export the io instance
};

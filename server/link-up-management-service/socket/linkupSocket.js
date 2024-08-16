const linkupSocket = (io) => {
  const linkupNamespace = io.of("/linkup-management");

  linkupNamespace.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) {
      console.error("User ID is undefined. Disconnecting socket.");
      socket.disconnect();
      return;
    }

    socket.userId = userId;
    socket.join(`user-${userId}`);

    if (process.env.NODE_ENV === "development") {
      console.log(
        `User ${userId} connected to the linkup service socket`,
        JSON.stringify(socket.handshake.query)
      );
    }

    // Handle "join-linkup-room" event
    socket.on("join-linkup-room", (linkupId) => {
      if (!linkupId) {
        console.error("Linkup ID is undefined in join-linkup-room event.");
        return;
      }
      socket.join(`linkup-${linkupId}`);
      if (process.env.NODE_ENV === "development") {
        console.log(`User ${userId} joined linkup room ${linkupId}`);
      }
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `User ${userId} disconnected from the linkup service socket`
        );
      }
    });

    // Handle Socket.IO errors
    socket.on("error", (error) => {
      console.error("Socket.IO Error:", error);
    });
  });

  return io; // Return the io instance
};

module.exports = linkupSocket;

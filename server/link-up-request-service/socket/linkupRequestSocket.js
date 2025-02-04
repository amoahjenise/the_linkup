// Define the linkupRequestSocket function
const linkupRequestSocket = (io) => {
  const linkupRequestNamespace = io.of("/linkup-request");

  let userSockets = {}; // Define the userSockets object

  // Function to get socket instance by user ID
  const getSocketByUserId = (userId) => {
    return userSockets[userId];
  };

  linkupRequestNamespace.on("connection", (socket) => {
    if (process.env.NODE_ENV === "development") {
      console.log("A user connected to the linkup request service socket");
    }

    const userId = socket.handshake.query.userId;
    if (!userId) {
      console.error("Missing userId in socket handshake query");
      socket.disconnect();
      return;
    }

    socket.userId = userId;
    socket.join(`user-${userId}`);

    // Handle "request-sent" event
    socket.on("request-sent", (data) => {
      if (!data.creator_id) {
        console.error("Missing creator_id in request-sent event");
        return;
      }
      if (process.env.NODE_ENV === "development") {
        console.log("A request was sent.");
      }
      socket.to(`user-${data.creator_id}`).emit("new-linkup-request", data);
    });

    // Handle "request-accepted" event
    socket.on("request-accepted", (data) => {
      if (!data.requester_id) {
        console.error("Missing requester_id in request-accepted event");
        return;
      }
      if (process.env.NODE_ENV === "development") {
        console.log("Notify user that a request was approved.");
      }
      socket.to(`user-${data.requester_id}`).emit("request-accepted", data);
    });

    // Handle "request-declined" event
    socket.on("request-declined", (data) => {
      if (!data.requester_id) {
        console.error("Missing requester_id in request-declined event");
        return;
      }
      if (process.env.NODE_ENV === "development") {
        console.log("Notify user that a request was declined.");
      }
      socket.to(`user-${data.requester_id}`).emit("request-declined", data);
    });

    // Handle "join-linkup-room" event
    socket.on("join-linkup-room", (linkupId) => {
      if (!linkupId) {
        console.error("Missing linkupId in join-linkup-room event");
        return;
      }
      socket.join(`linkup-${linkupId}`);
      if (process.env.NODE_ENV === "development") {
        console.log(`User ${socket.userId} joined linkup room ${linkupId}`);
      }
    });

    // Handle disconnect event
    socket.on("disconnect", () => {
      if (process.env.NODE_ENV === "development") {
        console.log("A user disconnected from linkup request service");
      }
    });

    // Handle Socket.IO errors
    socket.on("error", (error) => {
      console.error("Socket.IO Error:", error);
    });
  });

  // Return the io instance
  return io;
};

module.exports = linkupRequestSocket;

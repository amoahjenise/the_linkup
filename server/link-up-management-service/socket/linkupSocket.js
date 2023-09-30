// linkupSocket.js (backend side)
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected to the linkup service socket");

    // Get the user ID or any unique identifier for the user
    const userId = socket.handshake.query.userId;
    // Assign the user's socket ID as the unique identifier
    socket.userId = userId;

    // You can also join rooms or perform other setup as needed
    socket.join(`user-${userId}`);

    console.log(`User ${userId} connected with socket ID ${socket.id}`);

    // // Handle real-time events here
    // socket.on("linkupCreated", (data) => {
    //   console.log("Real-time linkupCreated event");
    // });

    // // Handle the "linkupsExpired" event
    // socket.on("linkupsExpired", (data) => {
    //   // Ensure data contains the creator_id
    //   if (data && data.creator_id) {
    //     // Process the data and emit events as needed
    //     console.log("Real-time linkupsExpired event");

    //     // Use socket.to(data.creator_id) to send the event only to the specific user (creator)
    //     socket.to(data.creator_id).emit("sendExpiredLinkups", data);
    //   }
    // });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });

    // Handle Socket.IO errors
    socket.on("error", (error) => {
      console.error("Socket.IO Error:", error);
    });
  });
};

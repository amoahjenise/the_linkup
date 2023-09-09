// server/socket/linkupSocket.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected to the linkup service socket");

    // Handle real-time events here
    socket.on("createLinkup", (data) => {
      // Process the data and emit events as needed
      console.log("REAL-TIME CREATE LINKUP EVENT");
      // You can emit another event to notify clients about the linkup creation
      //   io.emit("linkupCreated", data);
    });

    // Handle the "linkupsExpired" event
    socket.on("linkupsExpired", (data) => {
      // Ensure data contains the creator_id
      if (data && data.creator_id) {
        // Process the data and emit events as needed
        console.log("REAL-TIME EXPIRED LINKUPS EVENT");
        // You can emit another event to notify the specific user (creator) about the linkup expiration
        // Use socket.to(userId).emit() to send notifications to a specific user
        socket.to(data.creator_id).emit("linkupExpired", data);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });

    // Join the room for the user
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
    });
  });

  // Require and initialize the controller with the socket instance
  const linkupController = require("../controllers/linkupController");
  linkupController.initializeSocket(io);
};

// server/socket/linkupSocket.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle real-time events here
    socket.on("createLinkup", (data) => {
      // Process the data and emit events as needed
      console.log("REAL-TIME CREATE LINKUP EVENT");
      // You can emit another event to notify clients about the linkup creation
      //   io.emit("linkupCreated", data);
    });

    socket.on("linkupsExpired", (data) => {
      // Process the data and emit events as needed
      console.log("REAL-TIME EXPIRED LINKUPS EVENT");
      // You can emit another event to notify clients about the linkups update
      //   io.emit("linkupsUpdated", data);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  // Require and initialize the controller with the socket instance
  const linkupController = require("../controllers/linkupController");
  linkupController.initializeSocket(io);
};

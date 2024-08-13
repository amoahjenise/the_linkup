// linkupRequestSocket.js (backend side)
const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected to the linkup request service socket");

    // Handle real-time events here
    socket.on("request-sent", (data) => {
      console.log("Notify user that a request was received.");
    });

    socket.on("request-approved", (data) => {
      console.log("Notify user that a request was approved.");
    });

    // Handle the "join-linkup-room" event
    socket.on("join-linkup-room", (linkupId) => {
      // Join the room with the linkup ID
      socket.join(`linkup-${linkupId}`);
      console.log(`User ${socket.userId} joined linkup room ${linkupId}`);
    });

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

module.exports = { initializeSocket }; // Export the function

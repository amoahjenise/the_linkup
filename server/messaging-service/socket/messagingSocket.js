// socket/messagingSocket.js
const userSockets = {}; // Define the userSockets object

// Function to get socket instance by user ID
const getSocketByUserId = (userId) => {
  return userSockets[userId];
};

// Initialize the socket functionality
const initializeSocket = (io, redisClient) => {
  io.on("connection", (socket) => {
    console.log("Messaging socket connected.");

    // Store the socket connection with the user ID
    socket.on("store-user-id", (userId) => {
      storeSocket(userId, socket.id, redisClient); // Call storeSocket function
    });

    // Handle real-time events here
    socket.on("message-sent", async (data) => {
      // Use getSocketByUserId and emit events based on Redis data
    });

    socket.on("marked-as-read", (data) => {
      console.log("Notify user that a message was read.");
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      // Remove the socket from the userSockets object on disconnect
    });
  });
};

// Export the functions
module.exports = {
  getSocketByUserId,
  initializeSocket,
};

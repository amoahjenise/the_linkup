let userSockets = {}; // Define the userSockets object

// Function to get socket instance by user ID
const getSocketByUserId = (userId) => {
  return userSockets[userId];
};

// Initialize the socket functionality
const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Link-up request socket connected.");

    // Store the socket connection with the user ID
    socket.on("store-user-id", (userId) => {
      userSockets[userId] = socket;
    });

    // Handle real-time events here
    socket.on("request-sent", (data) => {
      console.log("Notify user that a request was received.");
    });

    socket.on("request-approved", (data) => {
      console.log("Notify user that a request was approved.");
    });

    // Handle disconnect
    socket.on("request-declined", () => {
      console.log("Notify user that a request was declined.");
    });
  });
};

// Export the functions
module.exports = {
  getSocketByUserId,
  initializeSocket,
};

// linkupSocket.js (in link-up-management-service)
const socketIo = require("socket.io");

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["POST", "GET", "PATCH", "DELETE"],
    },
  });

  let userSockets = {}; // Define the userSockets object

  // Function to get socket instance by user ID
  const getSocketByUserId = (userId) => {
    return userSockets[userId];
  };

  io.on("connection", (socket) => {
    // Get the user ID or any unique identifier for the user
    const userId = socket.handshake.query.userId;
    // Assign the user's socket ID as the unique identifier
    socket.userId = userId;

    socket.join(`user-${userId}`);

    // // Store the socket connection with the user ID
    // socket.on("store-user-id", (userId) => {
    //   userSockets[userId] = socket;
    // });

    // // Handle real-time events here
    // socket.on("request-sent", (data) => {
    //   console.log("Notify user that a request was received.");
    // });

    // socket.on("request-approved", (data) => {
    //   console.log("Notify user that a request was approved.");
    // });

    // Handle disconnect
    socket.on("request-declined", () => {
      console.log("Notify user that a request was declined.");
    });
  });

  return io; // Export the io instance
};

// // Initialize the socket functionality
// const initializeSocket = (socket) => {
//   socket.on("connection", (socket) => {
//     console.log("Link-up request socket connected.");

//     // Get the user ID or any unique identifier for the user
//     const userId = socket.handshake.query.userId;
//     // Assign the user's socket ID as the unique identifier
//     socket.userId = userId;

//     socket.join(`user-${userId}`);

//     // Store the socket connection with the user ID
//     socket.on("store-user-id", (userId) => {
//       userSockets[userId] = socket;
//     });

//     // Handle real-time events here
//     socket.on("request-sent", (data) => {
//       console.log("Notify user that a request was received.");
//     });

//     socket.on("request-approved", (data) => {
//       console.log("Notify user that a request was approved.");
//     });

//     // Handle disconnect
//     socket.on("request-declined", () => {
//       console.log("Notify user that a request was declined.");
//     });
//   });
// };

// // Export the functions
// module.exports = {
//   getSocketByUserId,
//   initializeSocket,
// };

// // linkupRequestSocket.js (backend side)
// module.exports = (io) => {
//   io.on("connection", (socket) => {
//     console.log("A user connected to the linkup request service socket");

//     // Handle real-time events here
//     socket.on("request-sent", (data) => {
//       console.log("Notify user that a request was received.");
//     });

//     socket.on("request-approved", (data) => {
//       console.log("Notify user that a request was approved.");
//     });

//     // Handle the "join-linkup-room" event
//     socket.on("join-linkup-room", (linkupId) => {
//       // Join the room with the linkup ID
//       socket.join(`linkup-${linkupId}`);
//       console.log(`User ${socket.userId} joined linkup room ${linkupId}`);
//     });

//     // Handle disconnect
//     socket.on("disconnect", () => {
//       console.log("A user disconnected");
//     });

//     // Handle Socket.IO errors
//     socket.on("error", (error) => {
//       console.error("Socket.IO Error:", error);
//     });
//   });
// };

// let userSockets = {}; // Define the userSockets object

// // Function to get socket instance by user ID
// const getSocketByUserId = (userId) => {
//   return userSockets[userId];
// };

// // Initialize the socket functionality
// const initializeSocket = (io) => {
//   io.on("connection", (socket) => {
//     console.log("Link-up request socket connected.");

//     // Store the socket connection with the user ID
//     socket.on("store-user-id", (userId) => {
//       userSockets[userId] = socket;
//     });

//     // Handle real-time events here
//     socket.on("request-sent", (data) => {
//       console.log("Notify user that a request was received.");
//     });

//     socket.on("request-approved", (data) => {
//       console.log("Notify user that a request was approved.");
//     });

//     // Handle disconnect
//     socket.on("request-declined", () => {
//       console.log("Notify user that a request was declined.");
//     });
//   });
// };

// // Export the functions
// module.exports = {
//   getSocketByUserId,
//   initializeSocket,
// };

const express = require("express");
const helmet = require("helmet");
const app = express();
const router = require("./routes/linkupRequestRoutes");
const cors = require("cors");
// const http = require("http");
// const socketIo = require("socket.io");
// const linkupRequestSocket = require("./socket/linkupRequestSocket");

// Use helmet middleware to set security headers
app.use(helmet());

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST"],
    optionsSuccessStatus: 200,
    credentials: true, // Enable credentials for all routes
  })
);

app.use("/api", router);

// const server = http.createServer(app);

// Configure CORS for Socket.IO
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000", // Allow connections from the frontend
//     methods: ["GET", "POST"],
//   },
// });

// Pass the io instance to linkupRequestSocket module
// linkupRequestSocket.initializeSocket(io);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Link-up request service running on port ${PORT}`);
});

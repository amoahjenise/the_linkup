const express = require("express");
const app = express();
const router = require("./routes/linkupRequestRoutes");
const cors = require("cors");
// const http = require("http");
// const socketIo = require("socket.io");
// const linkupRequestSocket = require("./socket/linkupRequestSocket");

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3000"],
    methods: ["POST"],
    optionsSuccessStatus: 200,
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

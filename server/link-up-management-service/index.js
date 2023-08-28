const express = require("express");
const app = express();
const router = require("./routes/linkupRoutes");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const linkupSocket = require("./socket/linkupSocket");

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3000"],
    methods: ["POST", "GET", "PATCH", "DELETE"],
    optionsSuccessStatus: 200,
  })
);

app.use("/api", router);

const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow connections from the frontend
    methods: ["GET", "POST"],
  },
});

linkupSocket(io); // Initialize socket.io with the server instance

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Link-up service running on port ${PORT}`);
});

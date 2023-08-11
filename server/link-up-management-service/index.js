const express = require("express");
const app = express();
const router = require("./routes/linkupRoutes");
const cors = require("cors");
const linkupController = require("./controllers/linkupController");

const io = require("socket.io")(3004, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PATCH", "DELETE"],
    optionsSuccessStatus: 200,
  })
);

app.use("/api", router);

// Listen to incoming WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Example: Send a welcome message to the connected user
  socket.emit("welcome", "Welcome to the Link Up Management Service!");

  // Handle real-time events here
  socket.on("createLinkup", (data) => {
    // Process the data and emit events as needed
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Pass the io object to the controller
linkupController.initializeSocket(io);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Link-Up service running on port ${PORT}`);
});

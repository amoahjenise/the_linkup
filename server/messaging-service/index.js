const express = require("express");
const app = express();
const helmet = require("helmet");
const router = require("./routes/messagingRoutes");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);

// Use helmet middleware to set security headers
app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "PATCH"],
  })
);

app.use("/api", router);

// Initialize socket event handlers

// const { initializeSocket } = require("./socket/messagingSocket"); // Destructure the initializeSocket function

// // Pass the io instance to initializeSocket
// initializeSocket(server);

const PORT = process.env.PORT || 3006;
server.listen(PORT, () => {
  console.log(`Messaging service running on port ${PORT}`);
});

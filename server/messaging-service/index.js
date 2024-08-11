const express = require("express");
const app = express();
const helmet = require("helmet");
const router = require("./routes/messagingRoutes");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:3000"; // Default to your front-end URL

// Use helmet middleware to set security headers
app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: [ALLOWED_ORIGIN],
    methods: ["POST", "GET", "PATCH"],
  })
);

app.use("/api/messaging", router);

// Initialize socket event handlers

// const { initializeSocket } = require("./socket/messagingSocket"); // Destructure the initializeSocket function

// // Pass the io instance to initializeSocket
// initializeSocket(server);

const PORT = process.env.MESSAGING_SERVICE_PORT || 5006;
server.listen(PORT, () => {
  console.log(`Messaging service running on port ${PORT}`);
});

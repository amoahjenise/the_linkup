const express = require("express");
const app = express();
const helmet = require("helmet");
const router = require("./routes/notificationRoutes");
const cors = require("cors");
const http = require("http");
const { initSocketServer } = require("./socket/notificationSocket"); // Import the socket server initialization function
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:3000"; // Default to your front-end URL

// Use helmet middleware to set security headers
app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: [ALLOWED_ORIGIN],
    methods: ["POST", "PUT"],
    optionsSuccessStatus: 200,
    // credentials: true, // Enable credentials for all routes
  })
);

app.use("/api/notifications", router);

const server = http.createServer(app);

// Pass the server instance to the socket server initialization function
initSocketServer(server);

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});

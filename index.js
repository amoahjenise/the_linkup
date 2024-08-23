// index.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");

const {
  scheduleLinkupExpiryJob,
} = require("./server/link-up-management-service/scheduled-jobs/linkup-expiry-job");

// Import and set up Socket.IO namespaces
const {
  initializeSocket: linkupInitializeSocket,
} = require("./server/link-up-management-service/controllers/linkupController");
const {
  initializeSocket: linkupRequestInitializeSocket,
} = require("./server/link-up-request-service/controllers/linkupRequestController");

// Import your event handlers
const linkupSocket = require("./server/link-up-management-service/socket/linkupSocket");
const linkupRequestSocket = require("./server/link-up-request-service/socket/linkupRequestSocket");

// Import microservice routers
const authRouter = require("./server/auth-service/index");
const userRouter = require("./server/user-management-service/index");
const linkupRouter = require("./server/link-up-management-service/index");
const linkupRequestRouter = require("./server/link-up-request-service/index");
const imageRouter = require("./server/image-service/index");
const locationRouter = require("./server/location-service/index");
const messagingRouter = require("./server/messaging-service/index");
const notificationRouter = require("./server/notification-service/index");

// Initialize the Express app and HTTP server
const app = express();
const server = http.createServer(app);

const ALLOWED_ORIGINS = [
  process.env.ALLOWED_ORIGIN || "https://13b0-70-52-4-231.ngrok-free.app",
  "http://localhost:3000",
];

const io = socketIo(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["POST", "GET", "PATCH", "DELETE"],
  },
});

// Initialize socket event handlers
const linkupIo = linkupSocket(io);
linkupInitializeSocket(linkupIo.of("/linkup-management")); // Use the correct namespace

const linkupRequestIo = linkupRequestSocket(io);
linkupRequestInitializeSocket(linkupRequestIo.of("/linkup-request")); // Use the correct namespace

app.use("/api/auth/api/webhooks", bodyParser.raw({ type: "*/*" }));
app.use("/api/user/api/webhooks", bodyParser.raw({ type: "*/*" }));

app.use(express.json());

app.use(
  cors({
    origin: [
      process.env.ALLOWED_ORIGIN || "https://13b0-70-52-4-231.ngrok-free.app",
      "http://localhost:3000",
    ],
    methods: ["POST", "GET", "PATCH", "DELETE"],
  })
);

// Set up routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/linkup", linkupRouter);
app.use("/api/linkup-requests", linkupRequestRouter);
app.use("/api/image", imageRouter);
app.use("/api/location", locationRouter);
app.use("/api/messaging", messagingRouter);
app.use("/api/notifications", notificationRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client", "build")));

// Catch-all handler to return the React app for any request not handled by the server
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Schedule the job to run every minute
scheduleLinkupExpiryJob(io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

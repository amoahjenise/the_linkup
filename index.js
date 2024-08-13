const express = require("express");
const http = require("http");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const { Server: SocketIOServer } = require("socket.io");

// Import microservice routers
const userRouter = require("./server/user-management-service/index");
const linkupRouter = require("./server/link-up-management-service/index");
const linkupRequestRouter = require("./server/link-up-request-service/index");
const imageRouter = require("./server/image-service/index");
const locationRouter = require("./server/location-service/index");
const messagingRouter = require("./server/messaging-service/index");
const notificationRouter = require("./server/notification-service/index");

// Import socket handlers
const linkupSocket = require("./server/link-up-management-service/socket/linkupSocket");
const linkupRequestSocket = require("./server/link-up-request-service/socket/linkupRequestSocket");
const {
  initSocketServer: initNotificationSocketServer,
} = require("./server/notification-service/socket/notificationSocket");

// Initialize the Express app
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Middleware
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: [process.env.ALLOWED_ORIGIN || "http://localhost:3000"],
    methods: ["POST", "GET", "PATCH", "DELETE"],
  })
);

// Set up routers
app.use("/api/user", userRouter);
app.use("/api/linkup", linkupRouter);
app.use("/api/linkup-requests", linkupRequestRouter);
app.use("/api/image", imageRouter);
app.use("/api/location", locationRouter);
app.use("/api/messaging", messagingRouter);
app.use("/api/notifications", notificationRouter);

// Socket Initialization
linkupSocket.initializeSocket(io);
linkupRequestSocket.initializeSocket(io);
initNotificationSocketServer(io);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client", "build")));

// Catch-all handler to return the React app for any request not handled by the server
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const path = require("path");
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client", "build")));

// Import and use microservices
const authService = require("./server/auth-service/index");
const userService = require("./server/user-management-service/index");
const linkUpService = require("./server/link-up-management-service/index");
const linkUpRequestService = require("./server/link-up-request-service/index");
const imageService = require("./server/image-service/index");
const locationService = require("./server/location-service/index");
const notificationService = require("./server/notification-service/index");
const messagingService = require("./server/messaging-service/index");

// Set up routes for each microservice
app.use("/api/auth", authService);
app.use("/api/users", userService);
app.use("/api/linkups", linkUpService);
app.use("/api/linkup-requests", linkUpRequestService);
app.use("/api/images", imageService);
app.use("/api/locations", locationService);
app.use("/api/notifications", notificationService);
app.use("/api/messaging", messagingService);

// Catch-all handler to return the React app for any request not handled by the server
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const router = express.Router(); // Create a router instance
const { initSocketServer } = require("./socket/notificationSocket"); // Import the socket server initialization function

const ALLOWED_ORIGINS = [
  process.env.ALLOWED_ORIGIN || "https://13b0-70-52-4-231.ngrok-free.app",
  "http://localhost:3000",
];

// Use helmet middleware to set security headers
router.use(helmet());
router.use(express.json());

router.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ["POST", "PUT"],
    optionsSuccessStatus: 200,
    // credentials: true, // Enable credentials for all routes
  })
);

// Define and use the route files for notifications
const notificationRoutes = require("./routes/notificationRoutes");
router.use("/", notificationRoutes);

// Initialize socket server function (for integration in main server file)
const initializeSocketServer = (server) => {
  initSocketServer(server);
};

// Error handling middleware (you can customize this)
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Export the router and socket server initialization function
module.exports = router;

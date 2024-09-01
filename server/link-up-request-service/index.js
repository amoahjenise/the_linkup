const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// Create a router instance
const router = express.Router();

// Configuration using environment variables
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
    methods: ["POST", "GET", "PATCH", "DELETE"],
  })
);

// Define and use the route files for linkup requests
const linkupRequestRoutes = require("./routes/linkupRequestRoutes");
router.use("/", linkupRequestRoutes);

// Export the router
module.exports = router;

// Import and initialize socket event handlers in the main server file

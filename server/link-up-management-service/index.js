const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const {
  scheduleLinkupExpiryJob,
} = require("./scheduled-jobs/linkup-expiry-job");

// Create a router instance
const router = express.Router();

// Configuration using environment variables
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:3000"; // Default to your front-end URL

// Use helmet middleware to set security headers
router.use(helmet());
router.use(express.json());
router.use(
  cors({
    origin: [ALLOWED_ORIGIN],
    methods: ["POST", "GET", "PATCH", "DELETE"],
  })
);

// Define and use the route files for linkups and users
const linkupRoutes = require("./routes/linkupRoutes");
router.use("/api/linkup", linkupRoutes);

// Initialize socket event handlers
const linkupSocket = require("./socket/linkupSocket");
const { initializeSocket } = require("./controllers/linkupController");

// Schedule the job to run every minute
scheduleLinkupExpiryJob();

// Export the router
module.exports = router;

// Initialize socket after exporting router (assumes socket setup will be handled elsewhere)

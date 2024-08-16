const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

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

// Define and use the route files for location
const locationRoutes = require("./routes/locationRoutes");
router.use("/", locationRoutes);

// Error handling middleware (you can customize this)
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Export the router
module.exports = router;

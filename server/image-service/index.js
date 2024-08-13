const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const imageRoutes = require("./routes/imageRoutes");
const helmet = require("helmet");

// Create a router instance
const router = express.Router();

// Configuration using environment variables
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:3000"; // Default to your front-end URL

// Increase the request payload size limit (e.g., 10MB)
router.use(bodyParser.json({ limit: "10mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Use helmet middleware to set security headers
router.use(helmet());

// Middleware
router.use(
  cors({
    origin: [ALLOWED_ORIGIN],
    methods: ["POST", "GET"],
    optionsSuccessStatus: 200,
    // credentials: true, // Enable credentials for all routes
  })
);

// Routes
router.use("/api/image", imageRoutes);

// Error handling middleware (you can customize this)
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Export the router
module.exports = router;

const express = require("express");
const cors = require("cors");
const imageRoutes = require("./routes/imageRoutes");
const helmet = require("helmet");
const router = express();

const ALLOWED_ORIGINS = [
  process.env.ALLOWED_ORIGIN || "https://c279-76-65-81-166.ngrok-free.app",
  "http://localhost:3000",
];

// Use helmet middleware to set security headers
router.use(helmet());

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Middleware
router.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ["POST", "GET"],
    optionsSuccessStatus: 200,
    credentials: true, // Enable credentials for all routes
  })
);

// Routes
router.use("/", imageRoutes);

// Error handling middleware (you can customize this)
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Export the router
module.exports = router;

const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const imageRoutes = require("./routes/imageRoutes");

// Configuration using environment variables
const PORT = process.env.PORT || 3007;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:3000";

// Increase the request payload size limit (e.g., 10MB)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Middleware
app.use(
  cors({
    origin: [ALLOWED_ORIGIN],
    methods: ["POST", "GET"],
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

// Routes
app.use("/api", imageRoutes);

// Error handling middleware (you can customize this)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Image server is running on port ${PORT}`);
});

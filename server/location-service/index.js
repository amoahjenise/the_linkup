const express = require("express");
const helmet = require("helmet");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const { Client: ESClient } = require("@elastic/elasticsearch");
const locationRoutes = require("./routes/locationRoutes");
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:3000"; // Default to your front-end URL

// Configuration using environment variables
const PORT = process.env.LOCATION_SERVICE_PORT || 5008;

// const esClient = new ESClient({ node: `http://localhost:${PORT}` });

// Use helmet middleware to set security headers
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: [ALLOWED_ORIGIN],
    methods: ["POST", "GET", "PATCH", "DELETE"],
  })
);

// Routes
app.use("/api/location", locationRoutes);

// Error handling middleware (you can customize this)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Location server is running on port ${PORT}`);
});

const express = require("express");
const helmet = require("helmet");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:3000"; // Default to your front-end URL

// Import your event handlers
const linkupRequestSocket = require("./socket/linkupRequestSocket");

// Use helmet middleware to set security headers
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: [ALLOWED_ORIGIN],
    methods: ["POST", "GET", "PATCH", "DELETE"],
  })
);

// Define and use the route files for linkups and users
const linkupRequestRoutes = require("./routes/linkupRequestRoutes");
app.use("/api/linkup-requests", linkupRequestRoutes);

// Initialize socket event handlers
const { initializeSocket } = require("./controllers/linkupRequestController");
const io = linkupRequestSocket(server);
initializeSocket(io);

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Link-up service running on port ${PORT}`);
});

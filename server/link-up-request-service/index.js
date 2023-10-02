const express = require("express");
const helmet = require("helmet");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);

// Import your event handlers
const linkupRequestSocket = require("./socket/linkupRequestSocket");

// Use helmet middleware to set security headers
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PATCH", "DELETE"],
  })
);

// Define and use the route files for linkups and users
const linkupRequestRoutes = require("./routes/linkupRequestRoutes");
app.use("/api", linkupRequestRoutes);

// Initialize socket event handlers
const { initializeSocket } = require("./controllers/linkupRequestController");
const io = linkupRequestSocket(server);
initializeSocket(io);

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Link-up service running on port ${PORT}`);
});

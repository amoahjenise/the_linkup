const express = require("express");
const helmet = require("helmet");
const http = require("http");
const cors = require("cors");
const {
  scheduleLinkupExpiryJob,
} = require("./scheduled-jobs/linkup-expiry-job");

const app = express();
const server = http.createServer(app);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:3000"; // Default to your front-end URL

// Import your event handlers
const linkupSocket = require("./socket/linkupSocket");

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
const linkupRoutes = require("./routes/linkupRoutes");
app.use("/api/linkup", linkupRoutes);

// Initialize socket event handlers
const { initializeSocket } = require("./controllers/linkupController");
const io = linkupSocket(server);
initializeSocket(io);

// Schedule the job to run every minute
scheduleLinkupExpiryJob(io);

const PORT = process.env.LINKUP_MANAGEMENT_SERVICE_PORT || 5003;
server.listen(PORT, () => {
  console.log(`Link-up service running on port ${PORT}`);
});

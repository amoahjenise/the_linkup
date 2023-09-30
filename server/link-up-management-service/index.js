const express = require("express");
const helmet = require("helmet");
const http = require("http");
const socketIo = require("socket.io");
const {
  scheduleLinkupExpiryJob,
} = require("./scheduled-jobs/linkup-expiry-job");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PATCH", "DELETE"],
  },
});

// Import your event handlers
const linkupSocket = require("./socket/linkupSocket");

// Use helmet middleware to set security headers
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PATCH", "DELETE"],
    // credentials: true,
  })
);

// Define and use the route files for linkups and users
const linkupRoutes = require("./routes/linkupRoutes");
app.use("/api", linkupRoutes);

// Initialize socket event handlers
linkupSocket(io);

// Call the initializeSocket function with the io object
const { initializeSocket } = require("./controllers/linkupController");
initializeSocket(io);

// Schedule the job to run every minute
scheduleLinkupExpiryJob(io);

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Link-up service running on port ${PORT}`);
});

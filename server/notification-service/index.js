const express = require("express");
const app = express();
const router = require("./routes/notificationRoutes");
const cors = require("cors");
const http = require("http");
const { initSocketServer } = require("./notificationService"); // Import the socket server initialization function

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.1.102:3000"],
    methods: ["POST", "PUT"],
    optionsSuccessStatus: 200,
  })
);

app.use("/api", router);

const server = http.createServer(app);

// Pass the server instance to the socket server initialization function
initSocketServer(server);

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});

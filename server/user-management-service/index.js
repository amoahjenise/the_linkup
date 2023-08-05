const express = require("express");
const app = express();
const avatarRoutes = require("./routes/avatarRoutes");
const userRoutes = require("./routes/userRoutes");

const cors = require("cors");

// Middleware to handle JSON and URL-encoded form data
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
    optionsSuccessStatus: 200,
  })
);

// Mount the avatarRoutes
app.use("/api", avatarRoutes);
app.use("/api", userRoutes);

// Start the server
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`User management server is running on http://localhost:${port}`);
});

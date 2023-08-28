const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");

const cors = require("cors");

// Middleware to handle JSON and URL-encoded form data
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.1.102:3000"],
    methods: ["POST", "GET", "PATCH"],
    optionsSuccessStatus: 200,
  })
);

// // Will need to modify CORS configuration for production
// app.use(
//   cors({
//     origin: [
//       "https://your-production-domain.com",
//       "https://your-other-domain.com",
//     ],
//     methods: ["POST", "GET", "PATCH"],
//     optionsSuccessStatus: 200,
//   })
// );

app.use("/api", userRoutes);

// Start the server
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`User management server is running on http://localhost:${port}`);
});

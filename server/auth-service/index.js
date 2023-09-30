const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const app = express();

// Use helmet middleware to set security headers
app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    optionsSuccessStatus: 200,
    credentials: true, // Allow credentials (cookies)
  })
);

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Use cookie-parser middleware
app.use(cookieParser());

// Routes for authentication
app.use("/api", authRoutes);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

// const express = require("express");
// const app = express();
// const router = require("./routes/authRoutes");
// const cors = require("cors");
// const helmet = require("helmet");
// const cookieParser = require("cookie-parser");

// // Use helmet middleware to set security headers
// app.use(helmet());

// app.use(express.json());

// // Use cookie-parser middleware
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: ["POST", "GET"],
//     optionsSuccessStatus: 200,
//     credentials: true, // Allow credentials (cookies)
//   })
// );

// app.use("/api", router);

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Auth service running on port ${PORT}`);
// });

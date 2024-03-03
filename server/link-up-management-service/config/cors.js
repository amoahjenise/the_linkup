const cors = require("cors");

// Define your CORS options
const corsOptions = {
  origin: "*",
  methods: ["POST", "GET", "PATCH", "DELETE"],
  // credentials: true, // Enable credentials for all routes
  allowedHeaders: ["Access-Control-Allow-Origin"],
};

module.exports = cors(corsOptions);

const { Webhook } = require("svix");
const express = require("express");
const app = express();
const helmet = require("helmet");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const bodyParser = require("body-parser");
const { deleteUser } = require("./controllers/userController");
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:3000"; // Default to your front-end URL

// Use helmet middleware to set security headers
app.use(helmet());

// // Middleware to handle JSON and URL-encoded form data
// app.use(express.json());

app.use(
  cors({
    origin: [ALLOWED_ORIGIN],
    methods: ["POST", "GET", "PATCH"],
    optionsSuccessStatus: 200,
    // credentials: true, // Enable credentials for all routes
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

// app.use("/api", userRoutes);

app.post(
  "/api/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async function (req, res) {
    try {
      // Check if the 'Signing Secret' from the Clerk Dashboard was correctly provided
      const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET_KEY;
      if (!WEBHOOK_SECRET) {
        throw new Error("You need a CLERK_WEBHOOK_SECRET_KEY in your .env");
      }

      // Grab the headers and body
      const headers = req.headers;
      const payload = req.body;

      // Get the Svix headers for verification
      const svix_id = headers["svix-id"];
      const svix_timestamp = headers["svix-timestamp"];
      const svix_signature = headers["svix-signature"];

      // If there are missing Svix headers, error out
      if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({
          success: false,
          message: "Error occurred -- no svix headers",
        });
      }

      // Initiate Svix
      const wh = new Webhook(WEBHOOK_SECRET);

      // Attempt to verify the incoming webhook
      const evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });

      // Grab the ID and TYPE of the Webhook
      const { id } = evt.data;
      const eventType = evt.type;

      if (eventType === "user.deleted") {
        try {
          const response = await deleteUser(id);
          // Send success response to webhook
          if (response.success) {
            console.log("User deleted successfully from database", response);
            res.status(200).json({ success: true, message: "User deleted" });
          } else {
            // Handle scenario where deleteUser function fails
            console.error("Error deleting user:", response.message);
            res.status(500).json({
              success: false,
              message: "Error deleting user",
            });
          }
        } catch (error) {
          console.error("Error deleting user:", error.message);
          // Send error response to webhook
          res.status(500).json({ success: false, message: error.message });
        }
      }
    } catch (err) {
      // Console log and return error
      console.log("Webhook failed to verify. Error:", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
  }
);

// Middleware to handle JSON and URL-encoded form data
app.use(express.json());

app.use("/api/user", userRoutes);

// Start the server
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`User management server is running on port ${port}`);
});

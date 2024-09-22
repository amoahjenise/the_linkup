const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Webhook } = require("svix");
const userRoutes = require("./routes/userRoutes");
const { getUserById, deleteUser } = require("./controllers/userController");

const ALLOWED_ORIGINS = [
  process.env.ALLOWED_ORIGIN || "https://c279-76-65-81-166.ngrok-free.app",
  "http://localhost:3000",
  "https://img.clerk.com",
];

const router = express.Router(); // Create a router instance

// Define the function to update Sendbird user image
const updateSendbirdUserImage = async (userId, publicUrl) => {
  const sendbirdApiUrl = `https://api-${process.env.SENDBIRD_APPLICATION_ID}.sendbird.com/v3/users/${userId}`;

  const response = await fetch(sendbirdApiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Api-Token": process.env.SENDBIRD_API_TOKEN, // Ensure you have your Sendbird API token in your environment
    },
    body: JSON.stringify({
      profile_url: publicUrl, // Update with the new public URL from Clerk
    }),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(
      `Failed to update Sendbird user image URL: ${errorResponse.message}`
    );
  }

  return response.json();
};

// Use helmet middleware to set security headers
// Middleware
router.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://grand-airedale-41.clerk.accounts.dev", // Replace with your actual Clerk FAPI hostname
        "https://challenges.cloudflare.com", // Cloudflare bot protection
        "'unsafe-inline'", // Required for Clerk's inline scripts
      ],
      connectSrc: [
        "'self'",
        "https://grand-airedale-41.clerk.accounts.dev", // Replace with your actual Clerk FAPI hostname
      ],
      imgSrc: [
        "'self'",
        "https://img.clerk.com", // Clerk's image hosting
        "data:", // Allow Base64 encoded images
      ],
      workerSrc: [
        "'self'",
        "blob:", // Required for worker scripts
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Clerk's runtime CSS-in-JS
      ],
      frameSrc: [
        "'self'",
        "https://challenges.cloudflare.com", // Cloudflare bot protection
      ],
      // Add any other directives you may need
    },
  })
);

router.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ["PUT", "POST", "GET", "PATCH"],
    optionsSuccessStatus: 200,
    // credentials: true, // Enable credentials for all routes
  })
);

// Webhook handler
router.post(
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
      const { id, publicUrl } = evt.data;
      const eventType = evt.type;

      if (eventType === "user.deleted") {
        // Check if the user exists in the database
        const userExists = await getUserById(id);
        if (!userExists.success) {
          console.error("User not found:", userExists.message);
          return res.status(404).json({
            success: false,
            message: "User not found, cannot delete.",
          });
        }

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
      } else if (eventType === "user.updated") {
        // Update Sendbird user image URL
        const sendbirdUpdateResponse = await updateSendbirdUserImage(
          id,
          publicUrl
        );
        console.log("Sendbird user image updated.", sendbirdUpdateResponse);
      }
    } catch (err) {
      // Console log and return error
      console.log("Webhook failed to verify. Error:", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
  }
);

// Middleware to handle JSON and URL-encoded form data
router.use(express.json());

// Define and use the route files for users
router.use("/", userRoutes);

// Export the router
module.exports = router;

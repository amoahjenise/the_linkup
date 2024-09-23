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
    },
  })
);

router.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ["PUT", "POST", "GET", "PATCH"],
    optionsSuccessStatus: 200,
  })
);

// Webhook handler
router.post(
  "/api/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async function (req, res) {
    try {
      const WEBHOOK_SECRET = process.env.CLERK_UPDATE_WEBHOOK_SECRET_KEY;
      if (!WEBHOOK_SECRET) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Missing Clerk webhook secret key.",
          });
      }

      const headers = req.headers;
      const payload = req.body;

      const svix_id = headers["svix-id"];
      const svix_timestamp = headers["svix-timestamp"];
      const svix_signature = headers["svix-signature"];

      if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({
          success: false,
          message: "Error occurred -- missing svix headers",
        });
      }

      const wh = new Webhook(WEBHOOK_SECRET);
      const evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });

      const { id, publicUrl } = evt.data;
      const eventType = evt.type;

      if (eventType === "user.deleted") {
        const userExists = await getUserById(id);
        if (!userExists.success) {
          return res.status(404).json({
            success: false,
            message: "User not found, cannot delete.",
          });
        }

        try {
          const response = await deleteUser(id);
          if (response.success) {
            return res
              .status(200)
              .json({ success: true, message: "User deleted successfully" });
          } else {
            return res.status(500).json({
              success: false,
              message: "Error deleting user",
            });
          }
        } catch (error) {
          return res
            .status(500)
            .json({ success: false, message: error.message });
        }
      } else if (eventType === "user.updated") {
        try {
          const sendbirdUpdateResponse = await updateSendbirdUserImage(
            id,
            publicUrl
          );
          return res.status(200).json({
            success: true,
            message: "Sendbird user image updated.",
            data: sendbirdUpdateResponse,
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: "Failed to update Sendbird user image.",
            error: error.message,
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: `Unhandled event type: ${eventType}`,
        });
      }
    } catch (err) {
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

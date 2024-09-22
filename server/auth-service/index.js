// Import necessary modules
const { Webhook } = require("svix");
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const helmet = require("helmet");
const {
  createUser,
  createSendbirdUser,
  storeSendbirdAccessToken,
} = require("./controllers/authController");
const { pool } = require("./db"); // Import your PostgreSQL connection pool
const { clerkClient } = require("@clerk/clerk-sdk-node"); // Import Clerk SDK

// Set allowed origins
const ALLOWED_ORIGINS = [
  process.env.ALLOWED_ORIGIN || "https://c279-76-65-81-166.ngrok-free.app",
  "http://localhost:3000",
];

function capitalizeFirstLetter(string) {
  if (!string) return string; // Handle empty strings
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Create an Express Router instance
const router = express.Router();

// Use helmet middleware to set security headers
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

// Use CORS middleware
router.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ["POST", "GET"],
    optionsSuccessStatus: 200,
  })
);

// Routes for authentication
router.use("/", authRoutes);

// Webhook handler
router.post(
  "/api/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    let client; // Declare client variable for transaction
    console.log("/api/webhooks API executed");
    try {
      // Begin transaction
      client = await pool.connect();
      await client.query("BEGIN");

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
          message: "Error occurred -- no Svix headers",
        });
      }

      console.log("svix headers are legit!");

      // Initiate Svix
      const wh = new Webhook(WEBHOOK_SECRET);

      // Attempt to verify the incoming webhook
      const evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });

      // Grab the ID and TYPE of the Webhook
      const { id, first_name, last_name, publicUrl, ...attributes } = evt.data;
      const eventType = evt.type;

      // Create formatted name as "First Name L."
      const formattedName = `${capitalizeFirstLetter(
        first_name
      )} ${capitalizeFirstLetter(last_name.charAt(0))}.`;

      if (eventType === "user.created") {
        const phoneNumber = attributes.phone_numbers[0].phone_number;
        const user = {
          id: id,
          phoneNumber: phoneNumber,
          name: formattedName,
        };

        console.log("createUser data:", user);

        // Call createUser with transaction client
        const response = await createUser(user, client);

        // Call createSendbirdUser with transaction client
        const sendbirdUser = {
          id: response.id,
          name: first_name,
        };

        const sendbirdResponse = await createSendbirdUser(sendbirdUser, client);
        console.log("User created with Sendbird API.", sendbirdResponse);

        // Store Sendbird access token
        const sendbirdToken = sendbirdResponse.access_token;
        await storeSendbirdAccessToken(response.id, sendbirdToken, client);
        console.log("Sendbird access token stored", sendbirdToken);
      }

      console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
      console.log("Webhook body:", evt.data);

      // Commit transaction
      await client.query("COMMIT");

      // Send a success response
      return res
        .status(200)
        .json({ success: true, message: "Webhook received" });
    } catch (err) {
      // Rollback transaction on error
      if (client) {
        await client.query("ROLLBACK");

        // Delete the Clerk user if creation fails
        if (err.message === "Error creating user") {
          await clerkClient.users.deleteUser(id);
        }
      }

      console.log("Webhook failed to verify. Error:", err.message);
      return res.status(400).json({ success: false, message: err.message });
    } finally {
      if (client) {
        client.release();
      }
    }
  }
);

// Export the router
module.exports = router;

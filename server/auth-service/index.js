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
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*"; // Default to your front-end URL

// Create an Express Router instance
const router = express.Router();

// Use helmet middleware to set security headers
router.use(helmet());

// Use CORS middleware
router.use(
  cors({
    origin: [ALLOWED_ORIGIN],
    methods: ["POST", "GET"],
    optionsSuccessStatus: 200,
    // credentials: true, // Allow credentials (cookies)
  })
);

// Middleware to parse JSON
// router.use(express.json());

// Routes for authentication
router.use("/", authRoutes);

router.post(
  "/api/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    let client; // Declare client variable for transaction
    console.log("/api/webhooks api executed");
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
      const payload = req.body.text();

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
      const { id, first_name, ...attributes } = evt.data;
      const eventType = evt.type;

      if (eventType === "user.created") {
        const phoneNumber = attributes.phone_numbers[0].phone_number;
        const user = {
          id: id,
          phoneNumber: phoneNumber,
          name: first_name,
        };

        console.log("createUser data:", user);
        console.log("createUser client:", client);

        // Call createUser with transaction client
        const response = await createUser(user, client);

        console.log("createSendbirdUser sendbirdUser:", sendbirdUser);
        console.log("createSendbirdUser client:", client);

        // Call createSendbirdUser with transaction client
        const sendbirdUser = { id: response.id, name: first_name };
        const sendbirdResponse = await createSendbirdUser(sendbirdUser, client);
        console.log("User created with Sendbird API.", sendbirdResponse);

        // Store Sendbird access token
        const sendbirdToken = sendbirdResponse.access_token;
        await storeSendbirdAccessToken(response.id, sendbirdToken, client);
        console.log("Sendbird access token stored", sendbirdToken);
      }

      console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
      // Console log the full payload to view
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

        // Delete the clerk user if creation fails
        if (err.message === "Error creating user") {
          await clerkClient.users.deleteUser(id);
        }
      }

      // Console log and return error
      console.log("Webhook failed to verify. Error:", err.message);
      return res.status(400).json({ success: false, message: err.message });
    } finally {
      // Release client back to the pool
      if (client) {
        client.release();
      }
    }
  }
);

// Export the router
module.exports = router;

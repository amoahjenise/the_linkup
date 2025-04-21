const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Webhook } = require("svix");
const userRoutes = require("./routes/userRoutes");
const {
  getUserByClerkIdForWebhook,
  deleteUser,
} = require("./controllers/userController");
const axios = require("axios");
const path = require("path"); // Add this
const fs = require("fs"); // Add this
const pool = require("./db"); // Make sure this is properly required

const ALLOWED_ORIGINS = [
  process.env.ALLOWED_ORIGIN || "https://c279-76-65-81-166.ngrok-free.app",
  "http://localhost:3000",
  "https://img.clerk.com",
];

console.log("Webhook Secret:", process.env.CLERK_UPDATE_WEBHOOK_SECRET_KEY);

const router = express.Router(); // Create a router instance

const handleClerkUserUpdate = async (clerkEvent) => {
  console.log("[handleClerkUserUpdate] Starting user update process...");
  console.log(
    "[handleClerkUserUpdate] Received Clerk event:",
    JSON.stringify(clerkEvent, null, 2)
  );

  try {
    const clerkUserId = clerkEvent.data.id;
    const firstName = clerkEvent.data.first_name;
    const lastName = clerkEvent.data.last_name;
    const fullName = `${firstName} ${lastName}`.trim();
    const profileImageUrl = clerkEvent.data.image_url;

    console.log(
      `[handleClerkUserUpdate] Processing update for Clerk user: ${clerkUserId}`
    );
    console.log(`[handleClerkUserUpdate] New name: ${fullName}`);
    console.log(
      `[handleClerkUserUpdate] New profile image URL: ${profileImageUrl}`
    );

    // 1. Update PostgreSQL database
    console.log("[handleClerkUserUpdate] Starting database update...");
    const updateQueryPath = path.join(
      __dirname,
      "../db/queries/updateUserFromClerk.sql"
    );
    console.log(`[handleClerkUserUpdate] Using query from: ${updateQueryPath}`);

    const updateQuery = fs.readFileSync(updateQueryPath, "utf8");
    const updateValues = [clerkUserId, fullName, profileImageUrl];
    console.log("[handleClerkUserUpdate] Query values:", updateValues);

    const dbResult = await pool.query(updateQuery, updateValues);
    const updatedUser = dbResult.rows[0];
    console.log(
      "[handleClerkUserUpdate] Database update result:",
      dbResult.rowCount > 0 ? "Success" : "No rows affected"
    );

    if (!updatedUser) {
      console.error(
        "[handleClerkUserUpdate] ERROR: User not found in database"
      );
      throw new Error("User not found in database");
    }

    console.log(
      "[handleClerkUserUpdate] Database updated successfully. Updated user:",
      updatedUser
    );

    // 2. Update Sendbird user - FIXED: Use process.env variables
    console.log("[handleClerkUserUpdate] Starting Sendbird update...");
    console.log(
      `[handleClerkUserUpdate] Updating Sendbird user ID: ${updatedUser.id}`
    );

    const sendbirdPayload = {
      nickname: fullName,
      profile_url: profileImageUrl,
    };
    console.log("[handleClerkUserUpdate] Sendbird payload:", sendbirdPayload);

    const sendbirdResponse = await axios.put(
      `https://api-${process.env.SENDBIRD_APP_ID}.sendbird.com/v3/users/${updatedUser.id}`,
      sendbirdPayload,
      {
        headers: {
          "Api-Token": process.env.SENDBIRD_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "[handleClerkUserUpdate] Sendbird response status:",
      sendbirdResponse.status
    );
    console.log(
      "[handleClerkUserUpdate] Sendbird response data:",
      sendbirdResponse.data
    );

    const result = {
      success: true,
      message: "User updated successfully in both database and Sendbird",
      user: updatedUser,
      sendbirdResponse: sendbirdResponse.data,
    };

    console.log(
      "[handleClerkUserUpdate] Update completed successfully:",
      result
    );
    return result;
  } catch (error) {
    console.error("[handleClerkUserUpdate] ERROR:", error);

    if (error.response) {
      console.error("[handleClerkUserUpdate] Sendbird API error details:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error(
        "[handleClerkUserUpdate] No response received from Sendbird"
      );
    }

    throw {
      ...error,
      _logged: true,
    };
  }
};

const updateSendbirdUserImage = async (userId, imageUrl) => {
  const sendbirdApiUrl = `https://api-${process.env.SENDBIRD_APP_ID}.sendbird.com/v3/users/${userId}`;
  console.log("SENDBIRD_API_TOKEN", process.env.SENDBIRD_API_TOKEN); // Fix the reference

  try {
    const response = await axios.put(
      sendbirdApiUrl,
      { profile_url: imageUrl },
      {
        headers: {
          "Api-Token": process.env.SENDBIRD_API_TOKEN,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to update Sendbird user image URL: ${
        error.response?.data?.message || error.message
      }`
    );
  }
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
// ...

// Middleware to handle JSON and URL-encoded form data
router.use(express.json());

// Define and use the route files for users
router.use("/", userRoutes);

// Webhook handler
router.post(
  "/api/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async function (req, res) {
    try {
      const WEBHOOK_SECRET = process.env.CLERK_UPDATE_WEBHOOK_SECRET_KEY;
      if (!WEBHOOK_SECRET) {
        return res.status(400).json({
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

      const { id, image_url } = evt.data;
      const eventType = evt.type;

      console.log("eventType:", eventType);

      const userExists = await getUserByClerkIdForWebhook(id); // Fetch the user
      console.log("userExists", userExists);

      if (!userExists.success) {
        console.log("User not found, cannot proceed.");

        return res.status(404).json({
          success: false,
          message: "User not found, cannot proceed.",
        });
      }

      if (eventType === "user.deleted") {
        try {
          const response = await deleteUser(userExists.user.clerk_user_id);
          if (response.success) {
            return res
              .status(200)
              .json({ success: true, message: "User deleted successfully" });
          } else {
            return res
              .status(500)
              .json({ success: false, message: "Error deleting user" });
          }
        } catch (error) {
          return res
            .status(500)
            .json({ success: false, message: error.message });
        }
      } else if (eventType === "user.updated") {
        try {
          console.log("Reached user.updated.");

          const result = await handleClerkUserUpdate(evt);
          return res.status(200).json(result);
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

// Export the router
module.exports = router;

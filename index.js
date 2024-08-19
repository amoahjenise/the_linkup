// index.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  createUser,
  createSendbirdUser,
  storeSendbirdAccessToken,
} = require("./server/auth-service/controllers/authController");

const {
  scheduleLinkupExpiryJob,
} = require("./server/link-up-management-service/scheduled-jobs/linkup-expiry-job");

// Import and set up Socket.IO namespaces
const {
  initializeSocket: linkupInitializeSocket,
} = require("./server/link-up-management-service/controllers/linkupController");
const {
  initializeSocket: linkupRequestInitializeSocket,
} = require("./server/link-up-request-service/controllers/linkupRequestController");

// Import your event handlers
const linkupSocket = require("./server/link-up-management-service/socket/linkupSocket");
const linkupRequestSocket = require("./server/link-up-request-service/socket/linkupRequestSocket");

// Import microservice routers
const authRouter = require("./server/auth-service/index");
const userRouter = require("./server/user-management-service/index");
const linkupRouter = require("./server/link-up-management-service/index");
const linkupRequestRouter = require("./server/link-up-request-service/index");
const imageRouter = require("./server/image-service/index");
const locationRouter = require("./server/location-service/index");
const messagingRouter = require("./server/messaging-service/index");
const notificationRouter = require("./server/notification-service/index");

// Initialize the Express app and HTTP server
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["POST", "GET", "PATCH", "DELETE"],
  },
});

// Initialize socket event handlers
const linkupIo = linkupSocket(io);
linkupInitializeSocket(linkupIo.of("/linkup-management")); // Use the correct namespace

const linkupRequestIo = linkupRequestSocket(io);
linkupRequestInitializeSocket(linkupRequestIo.of("/linkup-request")); // Use the correct namespace

// Middleware
app.use(
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

authRouter.post(
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

app.use(express.json());
app.use(
  cors({
    origin: [process.env.ALLOWED_ORIGIN || "http://localhost:3000"],
    methods: ["POST", "GET", "PATCH", "DELETE"],
  })
);

// Set up routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/linkup", linkupRouter);
app.use("/api/linkup-requests", linkupRequestRouter);
app.use("/api/image", imageRouter);
app.use("/api/location", locationRouter);
app.use("/api/messaging", messagingRouter);
app.use("/api/notifications", notificationRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client", "build")));

// Catch-all handler to return the React app for any request not handled by the server
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Schedule the job to run every minute
scheduleLinkupExpiryJob(io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

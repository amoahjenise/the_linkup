const { Webhook } = require("svix");
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const helmet = require("helmet");
const { createUser } = require("./controllers/authController");
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

// // Middleware for parsing JSON requests
// app.use(bodyParser.json());

// // Use cookie-parser middleware
// app.use(cookieParser());

// Routes for authentication
app.use("/api", authRoutes);

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
      const { id, ...attributes } = evt.data;
      const eventType = evt.type;

      if (eventType === "user.created") {
        const phoneNumber = attributes.phone_numbers[0].phone_number;
        const user = { id: id, phoneNumber: phoneNumber };
        const response = await createUser(user);
        console.log("User saved to database", response);
      }

      console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
      // Console log the full payload to view
      console.log("Webhook body:", evt.data);

      // Send a success response
      return res
        .status(200)
        .json({ success: true, message: "Webhook received" });
    } catch (err) {
      // Console log and return error
      console.log("Webhook failed to verify. Error:", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
  }
);

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

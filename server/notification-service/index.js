const express = require("express");
const app = express();
const router = require("./routes/notificationRoutes");
const cors = require("cors");

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT"],
    optionsSuccessStatus: 200,
  })
);

app.use("/api", router);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});

const express = require("express");
const app = express();
const router = require("./routes/authRoutes");
const cors = require("cors");

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3000"],
    methods: ["POST", "GET"],
    optionsSuccessStatus: 200,
  })
);

app.use("/api", router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

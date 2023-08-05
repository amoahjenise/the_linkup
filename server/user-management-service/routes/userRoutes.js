// userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Define routes
router.get("/getUser", userController.getUser);
router.post("/updateUserBio/:userId", userController.updateUserBio);
router.post("/updateUserAvatar/:userId", userController.updateUserAvatar);

module.exports = router;

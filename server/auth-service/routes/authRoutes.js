const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

// Route for user login
router.post("/authenticate-user", authController.loginUser);

// Route for getting existing user data via phone number
router.get("/get-user-by-clerk-id", authController.getUserByClerkId);

router.post("/store-user-online-status", authController.storeUserOnlineStatus);

module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Define routes
router.get("/get-user-by-id", userController.getUserById);
router.post("/create-user", userController.createUser);
router.patch("/update-user-bio/:userId", userController.updateUserBio); // Use PATCH for partial updates
router.patch("/update-user-avatar/:userId", userController.updateUserAvatar); // Use PATCH for partial updates

module.exports = router;

// userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Define routes
router.get("/get-user-by-id", userController.getUserById);
router.post("/create-user", userController.createUser);
router.post("/update-user-bio/:userId", userController.updateUserBio);
router.post("/update-user-avatar/:userId", userController.updateUserAvatar);

module.exports = router;

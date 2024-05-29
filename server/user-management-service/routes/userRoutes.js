const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyAccessToken } = require("../middlewares/userAuthMiddleware");

// Define routes
// router.get("/get-user-by-id", verifyAccessToken, userController.getUserById);
router.get("/get-user-by-id", userController.getUserById);
router.get("/get-user-by-clerk-id", userController.getUserByClerkId);
router.post("/delete-user/:userId", userController.deleteUser);
router.post("/deactivate-user/:userId", userController.deactivateUser);

router.patch(
  "/set-user-status-active/:userId",
  userController.setUserStatusActive
); // Use PATCH for partial updates
router.patch("/update-user-bio/:userId", userController.updateUserBio); // Use PATCH for partial updates
router.patch("/update-user-avatar/:userId", userController.updateUserAvatar); // Use PATCH for partial updates

// Route for update an existing user
router.patch("/update-user", userController.updateUser);

module.exports = router;

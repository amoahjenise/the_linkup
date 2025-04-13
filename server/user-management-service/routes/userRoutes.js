const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyAccessToken } = require("../middlewares/userAuthMiddleware");

router.get("/get-user-by-id", userController.getUserById);
router.get("/get-user-by-clerk-id", userController.getUserByClerkId);
router.post("/delete-user/:userId", userController.deleteUser);
router.post("/deactivate-user/:userId", userController.deactivateUser);
router.patch(
  "/update-user-social-media/:userId",
  userController.updateUserSocialMedia
);
router.patch(
  "/set-user-status-active/:userId",
  userController.setUserStatusActive
);
router.patch("/update-user-bio/:userId", userController.updateUserBio);
router.patch("/update-user-avatar/:userId", userController.updateUserAvatar);
router.patch("/update-user-name/:userId", userController.updateUserName);
router.patch("/update-user", userController.updateUser);
router.put("/update-sendbird-user/:userId", userController.updateSendbirdUser);

// New User Settings Routes
router.get("/:userId/settings/gender-options", userController.getGenderOptions);
router.get("/:userId/settings", userController.getUserSettings);
router.put("/:userId/settings", userController.saveUserSettings);

module.exports = router;

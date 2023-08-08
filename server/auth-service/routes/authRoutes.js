// authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/get-user-by-phonenumber", authController.getUserByPhoneNumber);
router.post("/authenticate-user", authController.authenticateUser);
router.post("/send-verification-code", authController.sendVerificationCode);
router.post("/verify-code", authController.verifyCode);
router.post("/resend-verification-code", authController.resendVerificationCode);
router.post("/verify-refresh-token", authController.verifyRefreshToken);
router.post("/logout", authController.logout);
router.post(
  "/verify-access-token",
  authMiddleware.verifyToken,
  authController.verifyAccessToken
);

module.exports = router;

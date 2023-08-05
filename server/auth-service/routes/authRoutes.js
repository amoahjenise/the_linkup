// authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/login", authController.authenticateUser);
router.post("/create-user", authController.createUser);
router.get("/getUser", authController.getUser);
router.post("/send-verification-code", authController.sendVerificationCode);
router.post("/verify-code", authController.verifyCode);
router.post("/resend-verification-code", authController.resendVerificationCode);
router.post("/verify-refresh-token", authController.verifyRefreshToken);
router.get("/logout", authController.logout);
router.get(
  "/verifyAccessToken",
  authMiddleware.verifyToken,
  authController.verifyAccessToken
);

module.exports = router;

const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authController");

const router = express.Router();

// Define the password validation options
const passwordValidationOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

// // Route for user registration
// router.post(
//   "/register",
//   [
//     check("phoneNumber").isMobilePhone(),
//     check("password").isStrongPassword(passwordValidationOptions),
//   ],
//   authController.registerUser
// );

// Route for user login
router.post(
  "/authenticate-user",
  [
    check("phoneNumber").isMobilePhone(),
    check("password").isStrongPassword(passwordValidationOptions),
  ],
  authController.loginUser
);

// Route for user login
router.post("/verify-code", authController.verifyCode);

// Route for user login
router.post("/send-verification-code", authController.sendVerificationCode);

// Route for getting existing user data via phone number
router.get("/get-user-by-phonenumber", authController.getUserByPhoneNumber);

// Route for refreshing tokens
router.post("/refresh-token", authController.refreshToken);

// Route for clearing the access token
router.post("/clear-access-token", authController.clearAccessToken);

// Route for registering a new user
// router.post("/register-user", authController.registerUser);

module.exports = router;

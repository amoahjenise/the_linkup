require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const {
  secret,
  accessTokenExpiration,
  refreshTokenExpiration,
} = require("../config"); // Create this config file
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const verifySid = process.env.VERIFY_SID;
const client = require("twilio")(accountSid, authToken);

// Register a new user
const registerUser = async (req, res) => {
  // Validate user input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { newUser } = req.body;

  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(newUser.password.trim(), 10);

    // Insert the user into the database
    const queryPath = path.join(__dirname, "../db/queries/registerUser.sql");
    const query = fs.readFileSync(queryPath, "utf8");
    const queryValues = [
      newUser.phoneNumber,
      hashedPassword,
      newUser.name,
      newUser.gender,
      newUser.dateOfBirth,
      newUser.avatarURL,
    ];

    const { rows, rowCount } = await pool.query(query, queryValues);

    if (rowCount > 0) {
      // Generate an access token
      const accessToken = jwt.sign({ userId: rows[0].id }, secret, {
        expiresIn: accessTokenExpiration,
      });

      // Store the access token in Cookies
      res.cookie("access_token", accessToken, {
        secure: process.env.ENVIRONMENT === "production",
        httpOnly: true,
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
        domain: "localhost",
        path: "/",
      });

      // Generate a refresh token for the user and store it
      const refreshToken = await generateRefreshToken(rows[0]);
      res.status(200).json({
        user: rows[0],
        access_token: accessToken,
        refresh_token: refreshToken,
        success: true,
        message: "Registration successful",
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to create user" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Failed to create user" });
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  // Validate user input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phoneNumber, password } = req.body;

  try {
    // Check if the user with the provided phone number exists
    const queryPath = path.join(
      __dirname,
      "../db/queries/getUserByPhoneNumber.sql"
    );

    const queryText = fs.readFileSync(queryPath, "utf8");
    const queryValues = [phoneNumber];

    const { rows, rowCount } = await pool.query(queryText, queryValues);

    if (rowCount === 0) {
      return res
        .status(401)
        .json({ message: "Invalid phone number or password" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, rows[0].password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid phone number or password" });
    }

    // Generate an access token
    const accessToken = jwt.sign({ userId: rows[0].id }, secret, {
      expiresIn: accessTokenExpiration,
    });

    res.cookie("access_token", accessToken, {
      secure: process.env.ENVIRONMENT === "production",
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
      domain: "localhost",
      path: "/",
    });

    const refreshToken = await generateRefreshToken(rows[0]);
    res.status(200).json({
      success: true,
      user: rows[0],
      accessToken,
      refreshToken,
      message: "Authentication successful",
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserByPhoneNumber = async (req, res) => {
  const { phoneNumber } = req.query;
  const queryPath = path.join(
    __dirname,
    "../db/queries/getUserByPhoneNumber.sql"
  );

  const query = fs.readFileSync(queryPath, "utf8");
  const queryValues = [phoneNumber];

  try {
    const { rows } = await pool.query(query, queryValues);

    if (rows.length > 0) {
      const user = rows[0];

      // User exists in the database
      res.json({ success: true, message: "User exists", user: user });
    } else {
      // User not found
      res.json({ success: false, message: "User not found", user: null });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

const verifyCode = async (req, res) => {
  const { phoneNumber, verificationCode } = req.body;
  try {
    // Verify the verification code using Twilio API
    const verificationResponse = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({
        to: phoneNumber,
        code: verificationCode,
      });
    if (verificationResponse.status === "approved") {
      // Phone number is verified
      res.json({
        success: true,
        message: "Phone number verified successfully",
        response: verificationResponse,
      });
    } else {
      // Verification code is invalid
      res.json({ success: false, message: "Invalid verification code" });
    }
  } catch (error) {
    console.error("Error verifying phone number:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to verify phone number" });
  }
};

const sendVerificationCode = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const response = await client.verify.v2
      .services(verifySid)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });
    res.json({
      success: true,
      message: "Verification code sent successfully",
      response: response,
    });
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({ message: "Failed to send verification code" });
  }
};

// Generate a refresh token and store it securely on the server
const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign({ userId: user.id }, secret, {
    expiresIn: refreshTokenExpiration,
  });

  // Encrypt the refresh token
  const saltRounds = 10;
  const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRounds);

  // Store the refreshToken in the database along with the user ID
  const insertRowCount = await insertRefreshToken(user.id, hashedRefreshToken);

  return refreshToken;
};

// Implement a route for refreshing tokens
const refreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, secret);
    // Check if the user associated with this token exists and is valid
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      decoded.userId,
    ]);
    if (!user.rows[0]) {
      throw new Error("Invalid user");
    }

    // Clear old access token from Cookies
    res.clearCookie("access_token");

    // Generate a new access token
    const accessToken = jwt.sign({ userId: user.rows[0].id }, secret, {
      expiresIn: accessTokenExpiration,
    });

    // Store new access token in Cookies
    res.cookie("access_token", accessToken, {
      secure: process.env.ENVIRONMENT === "production",
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
      domain: "localhost",
      path: "/",
    });

    // Return response
    res.json({
      success: true,
      message: "New access token generated successfully.",
      accessToken,
    });
  } catch (error) {
    console.error("Error in refreshToken:", error);
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};

// Helper function to insert hashed refresh token
const insertRefreshToken = async (userId, hashedRefreshToken) => {
  const queryPath = path.join(
    __dirname,
    "../db/queries/insertRefreshToken.sql"
  );
  const queryText = fs.readFileSync(queryPath, "utf8");
  const queryValues = [hashedRefreshToken, userId];
  const { rowCount } = await pool.query(queryText, queryValues);
  return rowCount;
};

const clearAccessToken = (req, res) => {
  res.clearCookie("access_token");
  res.json({ success: true, message: "Logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  getUserByPhoneNumber,
  verifyCode,
  sendVerificationCode,
  refreshToken,
  clearAccessToken,
};

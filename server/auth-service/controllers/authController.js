require("dotenv").config();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { pool } = require("../db");
const jwt = require("jsonwebtoken");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const verifySid = process.env.VERIFY_SID;
const client = require("twilio")(accountSid, authToken);

const authenticateUser = async (req, res) => {
  const { phoneNumber, password } = req.body;

  const queryPath = path.join(
    __dirname,
    "../db/queries/getUserByPhoneNumber.sql"
  );

  const queryText = fs.readFileSync(queryPath, "utf8");
  const queryValues = [phoneNumber];

  const { rows } = await pool.query(queryText, queryValues);

  if (rows.length > 0) {
    const user = rows[0];

    // User exists in the database, now verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Password is valid
    if (isPasswordValid) {
      // JWT: Generate the access and refresh tokens
      // Generate the access and refresh tokens
      const secretKey = process.env.JWT_SECRET_KEY;
      const accessToken = jwt.sign({ phoneNumber: phoneNumber }, secretKey, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign({ phoneNumber: phoneNumber }, secretKey, {
        expiresIn: "7d",
      });

      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);

      // Store the refresh token in an HTTP-only cookie for security
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Return the access token in the response
      res.json({
        user: user,
        success: true,
        token: accessToken,
        message: "Authentication successful",
      });
    } else {
      // Password is invalid
      res.json({ success: false, message: "Invalid Password" });
    }
  } else {
    // User does not exist in the database
    res.json({ success: false, message: "User not Found" });
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

    console.log(rows);

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

const verifyRefreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log("Refresh Token in verifyRefreshToken api:", refreshToken);
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(refreshToken, secretKey);

    // Generate a new access token
    const accessToken = jwt.sign(
      { phoneNumber: decoded.phoneNumber },
      secretKey,
      { expiresIn: "1h" }
    );

    console.log("Regenerated new access token:", accessToken);

    res.json({ success: true, token: accessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

const verifyAccessToken = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  console.log("Verifying  access token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, secretKey);

    // The token is valid; you can perform additional checks here if needed

    res.json({ success: true, phoneNumber: decoded.phoneNumber });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.json({ succes: true, message: "Logged out successfully" });
};

module.exports = {
  authenticateUser,
  getUserByPhoneNumber,
  sendVerificationCode,
  verifyCode,
  verifyRefreshToken,
  verifyAccessToken,
  logout,
};

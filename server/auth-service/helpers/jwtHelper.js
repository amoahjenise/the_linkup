require("dotenv").config();
const jwt = require("jsonwebtoken");

// Function to create a JWT token
const generateJWTToken = (payload, tokenType) => {
  const secretKey = process.env.JWT_SECRET_KEY; // Retrieve the JWT secret key from environment variables
  let expiresIn = "1h"; // Default expiration time for access tokens (1 hour)

  if (tokenType === "refresh") {
    expiresIn = "30d"; // Expiration time for refresh tokens (30 days)
  }

  const options = {
    expiresIn: expiresIn,
  };

  return jwt.sign(payload, secretKey, options);
};

// Function to verify and decode a JWT token
const verifyAndDecodeJWTToken = (token) => {
  const secretKey = process.env.JWT_SECRET_KEY; // Retrieve the JWT secret key from environment variables

  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token"); // Handle token verification error
  }
};

module.exports = {
  generateJWTToken,
  verifyAndDecodeJWTToken,
};

module.exports = {
  secret: process.env.JWT_SECRET_KEY, // Replace with your actual secret key
  accessTokenExpiration: "1h", // Adjust the token expiration time as needed
  refreshTokenExpiration: "7d",
};

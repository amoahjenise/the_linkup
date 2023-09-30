const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET_KEY;

// Middleware to verify the access token
const verifyAccessToken = (req, res, next) => {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  const accessTokenCookie = cookieHeader
    .split(";")
    .find((row) => row.trim().startsWith("access_token="));

  if (!accessTokenCookie) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  const accessToken = accessTokenCookie.split("=")[1];

  try {
    const decoded = jwt.verify(accessToken, secret);
    req.user = decoded; // Attach user data to the request object
    console.log("cookieHeader user: ", req.user);

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid access token" });
  }
};

module.exports = {
  verifyAccessToken,
};

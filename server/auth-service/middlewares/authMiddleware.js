const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, jwtSecretKey);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

module.exports = {
  verifyToken,
};

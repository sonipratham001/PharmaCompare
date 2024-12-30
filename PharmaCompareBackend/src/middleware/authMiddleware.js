const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config"); // Import jwtSecret from config

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    // Use jwtSecret from environment variable
    const decoded = jwt.verify(token, jwtSecret);  // Verifying the token with the environment secret
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
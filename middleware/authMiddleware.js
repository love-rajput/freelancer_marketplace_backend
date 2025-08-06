const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Read token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided. Unauthorized." });
  }

  const token = authHeader.split(" ")[1]; // "Bearer TOKEN"

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next(); // Proceed to route handler
  } catch (err) {
    console.error("Invalid token:", err);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;

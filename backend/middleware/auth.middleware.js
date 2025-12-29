const jwt = require("jsonwebtoken");

/**
 * 🔐 AUTH MIDDLEWARE
 * Token verify karta hai
 */
const protect = (req, res, next) => {
  let token;

  // Token header se lo: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // token se user info request mein attach
      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token"
      });
    }
  } else {
    return res.status(401).json({
      message: "No token provided"
    });
  }
};

/**
 * 🛡️ ROLE BASED ACCESS
 * Example: roleProtect("admin")
 */
const roleProtect = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }
    next();
  };
};

module.exports = {
  protect,
  roleProtect
};

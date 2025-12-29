/**
 * 🛡️ ROLE BASED AUTHORIZATION MIDDLEWARE
 * Example use:
 * roleMiddleware("admin")
 * roleMiddleware("tenant", "landlord")
 */

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "User role not found"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not authorized to access this route"
      });
    }

    next();
  };
};

module.exports = roleMiddleware;

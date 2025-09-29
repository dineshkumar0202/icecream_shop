const jwt = require("jsonwebtoken");
module.exports = function (roles = []) {
  // roles can be a single role string or array of roles. If empty, allow any authenticated user.
  if (typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    const h = req.headers["authorization"];
    if (!h) return res.status(401).json({ message: "No token provided" });
    const parts = h.split(" ");
    const token = parts.length === 2 ? parts[1] : parts[0];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      // if roles specified, check
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (e) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

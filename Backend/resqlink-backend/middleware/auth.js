// middleware/auth.js
const { verifyAccessToken } = require("../utils/jwt");
const { sendError }         = require("../utils/apiResponse");
const User                  = require("../models/User");

/**
 * protect — requires a valid JWT access token.
 * Token can come from:
 *   1. Authorization: Bearer <token>  header
 *   2. accessToken cookie
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Fallback to cookie
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return sendError(res, 401, "Access denied. Please log in.");
    }

    // Verify
    const decoded = verifyAccessToken(token);

    // Fetch fresh user (catches deactivated / deleted accounts)
    const user = await User.findById(decoded.id).select("-password -refreshToken");
    if (!user) {
      return sendError(res, 401, "User no longer exists.");
    }
    if (!user.isActive) {
      return sendError(res, 401, "Account is deactivated.");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, 401, "Session expired. Please log in again.");
    }
    return sendError(res, 401, "Invalid token. Please log in again.");
  }
};

/**
 * restrictTo — role-based access control.
 * Usage: restrictTo("admin", "ngo")
 */
const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return sendError(
      res,
      403,
      `Access denied. This action requires one of: ${roles.join(", ")}.`
    );
  }
  next();
};

/**
 * optionalAuth — attaches req.user if a valid token is present, but
 * does NOT block unauthenticated requests.
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) token = authHeader.split(" ")[1];
    if (!token && req.cookies?.accessToken)  token = req.cookies.accessToken;
    if (!token) return next();

    const decoded = verifyAccessToken(token);
    const user    = await User.findById(decoded.id).select("-password -refreshToken");
    if (user && user.isActive) req.user = user;
  } catch (_) {
    /* ignore — unauthenticated is fine here */
  }
  next();
};

module.exports = { protect, restrictTo, optionalAuth };

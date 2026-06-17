// utils/jwt.js
const jwt = require("jsonwebtoken");

const JWT_SECRET          = process.env.JWT_SECRET          || "fallback_secret_change_this";
const JWT_EXPIRES_IN      = process.env.JWT_EXPIRES_IN      || "7d";
const JWT_REFRESH_SECRET  = process.env.JWT_REFRESH_SECRET  || "fallback_refresh_secret";
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

/** Sign an access token */
const signAccessToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

/** Sign a refresh token */
const signRefreshToken = (payload) =>
  jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES });

/** Verify access token — returns payload or throws */
const verifyAccessToken = (token) =>
  jwt.verify(token, JWT_SECRET);

/** Verify refresh token — returns payload or throws */
const verifyRefreshToken = (token) =>
  jwt.verify(token, JWT_REFRESH_SECRET);

/** Cookie options (shared for both set & clear) */
const cookieOptions = (maxAgeMs) => ({
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge:   maxAgeMs,
});

const ACCESS_TOKEN_MAX_AGE  = 7  * 24 * 60 * 60 * 1000; // 7 days  in ms
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  cookieOptions,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
};

// utils/otp.js
const crypto = require("crypto");

/** Generate a cryptographically secure 6-digit OTP */
const generateOtp = () =>
  String(crypto.randomInt(100000, 999999));

/** Returns an OTP expiry Date (default 10 minutes from now) */
const otpExpiry = (minutes = 10) =>
  new Date(Date.now() + minutes * 60 * 1000);

/**
 * Verify an OTP against a stored OTP object.
 * Returns { valid: true } or { valid: false, reason: "..." }
 */
const verifyOtp = (stored, candidate) => {
  if (!stored || !stored.code) return { valid: false, reason: "No OTP found. Request a new one." };
  if (stored.verified)          return { valid: false, reason: "OTP already used." };
  if (stored.attempts >= 5)     return { valid: false, reason: "Too many attempts. Request a new OTP." };
  if (new Date() > stored.expiresAt) return { valid: false, reason: "OTP has expired. Request a new one." };
  if (stored.code !== String(candidate)) return { valid: false, reason: "Incorrect OTP." };
  return { valid: true };
};

module.exports = { generateOtp, otpExpiry, verifyOtp };

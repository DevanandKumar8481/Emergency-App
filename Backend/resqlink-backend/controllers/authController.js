// controllers/authController.js
const User = require("../models/User");
const { asyncHandler } = require("../middleware/errorHandler");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  cookieOptions,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} = require("../utils/jwt");
const { generateOtp, otpExpiry, verifyOtp } = require("../utils/otp");

//  Helpers 

/** Attach tokens to cookies AND return them in the response body */
const attachTokens = (res, user) => {
  const payload     = { id: user._id, role: user.role };
  const accessToken  = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  res.cookie("accessToken",  accessToken,  cookieOptions(ACCESS_TOKEN_MAX_AGE));
  res.cookie("refreshToken", refreshToken, cookieOptions(REFRESH_TOKEN_MAX_AGE));

  return { accessToken, refreshToken };
};

/** Build the safe user object for API responses */
const safeUser = (user) => user.toPublicJSON();

// ─── @desc   Register a new user (email + password)
// ─── @route  POST /api/auth/signup
// ─── @access Public
const signup = asyncHandler(async (req, res) => {
  const {
    role, name, orgName, contactPerson, regNumber, officerName,
    email, password, phone, emergencyPhone, location,
    skills, availability, emergencyType, resourceType,
  } = req.body;

  // Derive display name
  const displayName =
    ["volunteer", "requester"].includes(role) ? name : orgName;

  if (!displayName) {
    return sendError(res, 400, "Name or organisation name is required.");
  }

  // Prevent duplicates
  const emailExists = email
    ? await User.findOne({ email: email.toLowerCase() })
    : null;
  if (emailExists) return sendError(res, 409, "Email already registered.");

  const phoneExists = phone ? await User.findOne({ phone }) : null;
  if (phoneExists) return sendError(res, 409, "Phone number already registered.");

  // Build OTP for phone verification
  const otp     = generateOtp();
  const expires = otpExpiry(10);

  // In production: send OTP via Twilio / AWS SNS here.
  // For development we log it so you can test without SMS costs.
  console.log(`📱 OTP for ${phone}: ${otp}  (expires at ${expires.toISOString()})`);

  const user = await User.create({
    role, displayName,
    name, orgName, contactPerson, regNumber, officerName,
    email: email?.toLowerCase(),
    password,
    phone, emergencyPhone, location,
    skills, availability, emergencyType, resourceType,
    phoneOtp: { code: otp, expiresAt: expires, attempts: 0, verified: false },
  });

  return sendSuccess(res, 201, "Account created. Please verify your phone.", {
    userId: user._id,
    phone:  user.phone,
    // ⚠️ Remove 'otp' from the response in production — only use it during dev/testing
    otp: process.env.NODE_ENV !== "production" ? otp : undefined,
  });
});

// ─── @desc   Verify phone OTP (Step 3 of the signup flow)
// ─── @route  POST /api/auth/verify-otp
// ─── @access Public
const verifyPhoneOtp = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return sendError(res, 400, "userId and otp are required.");
  }

  const user = await User.findById(userId).select("+phoneOtp");
  if (!user) return sendError(res, 404, "User not found.");

  // Increment attempt counter first
  await User.updateOne(
    { _id: userId },
    { $inc: { "phoneOtp.attempts": 1 } }
  );

  const result = verifyOtp(user.phoneOtp, otp);
  if (!result.valid) return sendError(res, 400, result.reason);

  // Mark verified
  user.isPhoneVerified = true;
  user.phoneOtp        = { code: null, expiresAt: null, attempts: 0, verified: true };
  await user.save();

  const { accessToken, refreshToken } = attachTokens(res, user);

  // Persist refresh token hash in DB (rotation strategy)
  await User.updateOne({ _id: user._id }, { refreshToken });

  return sendSuccess(res, 200, "Phone verified. You're logged in!", {
    accessToken,
    user: safeUser(user),
  });
});

// ─── @desc   Resend phone OTP
// ─── @route  POST /api/auth/resend-otp
// ─── @access Public
const resendOtp = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) return sendError(res, 400, "userId is required.");

  const user = await User.findById(userId).select("+phoneOtp");
  if (!user) return sendError(res, 404, "User not found.");

  const otp     = generateOtp();
  const expires = otpExpiry(10);

  console.log(`📱 Resent OTP for ${user.phone}: ${otp}`);

  user.phoneOtp = { code: otp, expiresAt: expires, attempts: 0, verified: false };
  await user.save();

  return sendSuccess(res, 200, "OTP resent successfully.", {
    otp: process.env.NODE_ENV !== "production" ? otp : undefined,
  });
});

// ─── @desc   Login with email + password
// ─── @route  POST /api/auth/login
// ─── @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 400, "Email and password are required.");
  }

  // Explicitly select password (excluded by default)
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) return sendError(res, 401, "Invalid email or password.");

  // Locked account?
  if (user.isLocked) {
    return sendError(
      res, 423,
      "Account temporarily locked after too many failed attempts. Try again in 30 minutes."
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.incLoginAttempts();
    return sendError(res, 401, "Invalid email or password.");
  }

  // Phone must be verified
  if (!user.isPhoneVerified) {
    // Generate a fresh OTP so they can complete verification
    const otp     = generateOtp();
    const expires = otpExpiry(10);
    user.phoneOtp = { code: otp, expiresAt: expires, attempts: 0, verified: false };
    await user.save();
    console.log(`📱 Verification OTP for ${user.phone}: ${otp}`);

    return sendSuccess(res, 200, "Phone not verified. A new OTP has been sent.", {
      requiresVerification: true,
      userId: user._id,
      phone:  user.phone,
      otp:    process.env.NODE_ENV !== "production" ? otp : undefined,
    });
  }

  // Reset failed login counter
  await user.resetLoginAttempts();

  const { accessToken, refreshToken } = attachTokens(res, user);
  await User.updateOne({ _id: user._id }, { refreshToken });

  return sendSuccess(res, 200, "Logged in successfully.", {
    accessToken,
    user: safeUser(user),
  });
});

// ─── @desc   Login / verify via phone OTP (phone-only flow)
// ─── @route  POST /api/auth/login/phone
// ─── @access Public
const loginWithPhone = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone) return sendError(res, 400, "Phone number is required.");

  const user = await User.findOne({ phone });
  if (!user) {
    return sendError(
      res, 404,
      "No account found with this phone. Please sign up first."
    );
  }

  const otp     = generateOtp();
  const expires = otpExpiry(10);

  console.log(`📱 Login OTP for ${phone}: ${otp}`);

  user.phoneOtp = { code: otp, expiresAt: expires, attempts: 0, verified: false };
  await user.save();

  return sendSuccess(res, 200, "OTP sent successfully.", {
    userId: user._id,
    phone:  user.phone,
    otp:    process.env.NODE_ENV !== "production" ? otp : undefined,
  });
});

// ─── @desc   Verify phone OTP for login (phone-only flow)
// ─── @route  POST /api/auth/login/phone/verify
// ─── @access Public
const verifyLoginOtp = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) return sendError(res, 400, "userId and otp are required.");

  const user = await User.findById(userId).select("+phoneOtp");
  if (!user) return sendError(res, 404, "User not found.");

  await User.updateOne({ _id: userId }, { $inc: { "phoneOtp.attempts": 1 } });

  const result = verifyOtp(user.phoneOtp, otp);
  if (!result.valid) return sendError(res, 400, result.reason);

  user.isPhoneVerified = true;
  user.phoneOtp        = { code: null, expiresAt: null, attempts: 0, verified: true };
  await user.resetLoginAttempts();
  await user.save();

  const { accessToken, refreshToken } = attachTokens(res, user);
  await User.updateOne({ _id: user._id }, { refreshToken });

  return sendSuccess(res, 200, "Logged in successfully.", {
    accessToken,
    user: safeUser(user),
  });
});

// ─── @desc   Refresh access token
// ─── @route  POST /api/auth/refresh
// ─── @access Public (needs valid refresh token cookie or body)
const refreshToken = asyncHandler(async (req, res) => {
  const token =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) return sendError(res, 401, "No refresh token provided.");

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    return sendError(res, 401, "Invalid or expired refresh token. Please log in again.");
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    return sendError(res, 401, "Refresh token mismatch. Please log in again.");
  }

  const { accessToken, refreshToken: newRefreshToken } = attachTokens(res, user);
  await User.updateOne({ _id: user._id }, { refreshToken: newRefreshToken });

  return sendSuccess(res, 200, "Token refreshed.", { accessToken });
});

// ─── @desc   Logout
// ─── @route  POST /api/auth/logout
// ─── @access Private
const logout = asyncHandler(async (req, res) => {
  // Clear stored refresh token
  if (req.user) {
    await User.updateOne({ _id: req.user._id }, { $unset: { refreshToken: 1 } });
  }

  // Clear cookies
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return sendSuccess(res, 200, "Logged out successfully.");
});

// ─── @desc   Get current authenticated user
// ─── @route  GET /api/auth/me
// ─── @access Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return sendError(res, 404, "User not found.");
  return sendSuccess(res, 200, "Profile fetched.", { user: safeUser(user) });
});

// ─── @desc   Update current user's profile
// ─── @route  PATCH /api/auth/me
// ─── @access Private
const updateMe = asyncHandler(async (req, res) => {
  // Fields the user is NOT allowed to update directly
  const forbidden = ["password", "role", "isPhoneVerified", "isEmailVerified",
                     "loginAttempts", "lockUntil", "refreshToken", "phoneOtp"];
  forbidden.forEach((f) => delete req.body[f]);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    req.body,
    { new: true, runValidators: true }
  );

  return sendSuccess(res, 200, "Profile updated.", { user: safeUser(user) });
});

// ─── @desc   Change password (requires old password)
// ─── @route  PATCH /api/auth/change-password
// ─── @access Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return sendError(res, 400, "currentPassword and newPassword are required.");
  }
  if (newPassword.length < 6) {
    return sendError(res, 400, "New password must be at least 6 characters.");
  }

  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return sendError(res, 401, "Current password is incorrect.");

  user.password = newPassword;
  await user.save();

  // Invalidate all existing sessions
  await User.updateOne({ _id: user._id }, { $unset: { refreshToken: 1 } });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return sendSuccess(res, 200, "Password changed. Please log in again.");
});

// ─── @desc   Delete own account
// ─── @route  DELETE /api/auth/me
// ─── @access Private
const deleteMe = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return sendSuccess(res, 200, "Account deactivated successfully.");
});

module.exports = {
  signup,
  verifyPhoneOtp,
  resendOtp,
  login,
  loginWithPhone,
  verifyLoginOtp,
  refreshToken,
  logout,
  getMe,
  updateMe,
  changePassword,
  deleteMe,
};

// routes/authRoutes.js
const express      = require("express");
const rateLimit    = require("express-rate-limit");
const { body }     = require("express-validator");
const router       = express.Router();

const {
  signup, verifyPhoneOtp, resendOtp,
  login, loginWithPhone, verifyLoginOtp,
  refreshToken, logout,
  getMe, updateMe, changePassword, deleteMe,
} = require("../controllers/authController");

const { protect }  = require("../middleware/auth");
const { validate } = require("../middleware/validate");

// ─── Rate limiters ────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 min
  max:      20,
  message:  { success: false, message: "Too many requests. Try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders:   false,
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,   // 10 min
  max:      5,
  message:  { success: false, message: "Too many OTP requests. Wait 10 minutes." },
});

// ─── Validation chains 
const signupValidation = [
  body("role")
    .isIn(["volunteer", "requester", "provider", "ngo"])
    .withMessage("Role must be volunteer, requester, provider, or ngo."),

  body("email")
    .optional({ checkFalsy: true })
    .isEmail().normalizeEmail()
    .withMessage("Must be a valid email address."),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),

  body("phone")
    .matches(/^\+?\d{10,15}$/)
    .withMessage("Enter a valid phone number (10–15 digits, optional + prefix)."),

  body("location")
    .trim().notEmpty()
    .withMessage("Location is required."),
];

const loginValidation = [
  body("email")
    .isEmail().normalizeEmail()
    .withMessage("Enter a valid email address."),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

const otpValidation = [
  body("userId").notEmpty().withMessage("userId is required."),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage("OTP must be a 6-digit number."),
];

// ─── Routes ───────────────────────

// Public — auth
router.post("/signup",              authLimiter, signupValidation, validate, signup);
router.post("/verify-otp",          otpLimiter,  otpValidation,   validate, verifyPhoneOtp);
router.post("/resend-otp",          otpLimiter,  resendOtp);
router.post("/login",               authLimiter, loginValidation, validate, login);
router.post("/login/phone",         otpLimiter,  loginWithPhone);
router.post("/login/phone/verify",  otpLimiter,  otpValidation, validate, verifyLoginOtp);
router.post("/refresh",             refreshToken);

// Private — requires valid JWT
router.post("/logout",              protect, logout);
router.get("/me",                   protect, getMe);
router.patch("/me",                 protect, updateMe);
router.patch("/change-password",    protect, changePassword);
router.delete("/me",                protect, deleteMe);

module.exports = router;

// models/User.js
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

// ─── OTP sub-schema ──────────────
const OtpSchema = new mongoose.Schema(
  {
    code:      { type: String },
    expiresAt: { type: Date },
    attempts:  { type: Number, default: 0 },
    verified:  { type: Boolean, default: false },
  },
  { _id: false }
);

// ─── Stats sub-schema ─────────────
const StatsSchema = new mongoose.Schema(
  {
    livesAssisted: { type: Number, default: 0 },
    avgResponse:   { type: String, default: "—" },
    trustScore:    { type: String, default: "5.00" },
    streak:        { type: Number, default: 0 },
    requestsMade:  { type: Number, default: 0 },
    unitsSupplied: { type: Number, default: 0 },
    opsCoordinated:{ type: Number, default: 0 },
    rating:        { type: Number, default: 5.0 },
  },
  { _id: false }
);

// Main User schema 
const UserSchema = new mongoose.Schema(
  {
    // Identity 
    role: {
      type: String,
      enum: ["volunteer", "requester", "provider", "ngo"],
      required: [true, "Role is required"],
      default: "volunteer",
    },
    
    // Individual fields (volunteer / requester)
    name: {
      type: String,
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    
    displayName: { type: String, trim: true },

    // Organization fields (provider / ngo)
    orgName:       { type: String, trim: true },
    contactPerson: { type: String, trim: true },
    regNumber:     { type: String, trim: true },
    officerName:   { type: String, trim: true },

    //  Credentials
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,                     // allows null while keeping unique index
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,                    // never returned in queries by default
    },

    //  Contact 
    phone: {
      type: String,
      trim: true,
      match: [/^\+?\d{10,15}$/, "Please enter a valid phone number"],
    },
    emergencyPhone: { type: String, trim: true },
    location:       { type: String, trim: true },

    // Role-specific 
    skills:        { type: String, trim: true },              // volunteer
    availability:  {                                          // volunteer
      type: String,
      enum: ["Full Time", "Weekends", "On Call"],
      default: "On Call",
    },
    emergencyType: {                                          // requester
      type: String,
      enum: ["Medical", "Blood", "Food", "Shelter", "Transport"],
      default: "Medical",
    },
    resourceType:  {                                          // provider
      type: String,
      enum: ["Blood", "Food", "Medicine", "Transport", "Shelter"],
      default: "Blood",
    },

    //  Verification 
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    phoneOtp:        { type: OtpSchema, default: () => ({}) },
    emailOtp:        { type: OtpSchema, default: () => ({}) },

    //Security 
    passwordResetToken:   { type: String, select: false },
    passwordResetExpires: { type: Date,   select: false },
    refreshToken:         { type: String, select: false },
    lastLogin:            { type: Date },
    loginAttempts:        { type: Number, default: 0 },
    lockUntil:            { type: Date },

    //  Profile 
    isActive:  { type: Boolean, default: true },
    isOnline:  { type: Boolean, default: false },
    avatarUrl: { type: String },
    stats:     { type: StatsSchema, default: () => ({}) },
  },
  {
    timestamps: true,                   // createdAt, updatedAt
    toJSON:  { virtuals: true },
    toObject:{ virtuals: true },
  }
);

// Indexes 
UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ phone: 1 }, { unique: true, sparse: true });
UserSchema.index({ role: 1 });
UserSchema.index({ location: "text" });

// Virtuals 
UserSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

//  Pre-save: hash password 
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt  = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Pre-save: set displayName 
UserSchema.pre("save", function (next) {
  if (!this.displayName) {
    this.displayName =
      this.name || this.orgName || this.email?.split("@")[0] || "User";
  }
  next();
});

// Instance methods 
UserSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.incLoginAttempts = async function () {
  const LOCK_TIME    = 30 * 60 * 1000; // 30 min
  const MAX_ATTEMPTS = 5;

  if (this.lockUntil && this.lockUntil < Date.now()) {
    // Lock expired — reset
    return this.updateOne({
      $set:   { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= MAX_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: new Date(Date.now() + LOCK_TIME) };
  }
  return this.updateOne(updates);
};

UserSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $set:   { loginAttempts: 0, lastLogin: new Date() },
    $unset: { lockUntil: 1 },
  });
};

// Safe public profile (no sensitive fields)
UserSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  delete obj.phoneOtp;
  delete obj.emailOtp;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);

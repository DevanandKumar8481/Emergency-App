// routes/userRoutes.js
const express  = require("express");
const router   = express.Router();
const User     = require("../models/User");
const { protect, restrictTo } = require("../middleware/auth");
const { asyncHandler }        = require("../middleware/errorHandler");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// ─── GET /api/users/volunteers  — list verified volunteers (public)
router.get(
  "/volunteers",
  asyncHandler(async (req, res) => {
    const { location, availability, skills, page = 1, limit = 20 } = req.query;
    const filter = { role: "volunteer", isActive: true, isPhoneVerified: true };

    if (availability) filter.availability = availability;
    if (skills)       filter.skills       = { $regex: skills, $options: "i" };
    if (location)     filter.location     = { $regex: location, $options: "i" };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("displayName name role skills availability location stats createdAt")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, "Volunteers fetched.", {
      volunteers: users,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  })
);

// ─── GET /api/users/providers  — list resource providers (public)
router.get(
  "/providers",
  asyncHandler(async (req, res) => {
    const { resourceType, location } = req.query;
    const filter = { role: "provider", isActive: true };
    if (resourceType) filter.resourceType = resourceType;
    if (location)     filter.location     = { $regex: location, $options: "i" };

    const users = await User.find(filter)
      .select("displayName orgName contactPerson resourceType location phone stats")
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, "Providers fetched.", { providers: users });
  })
);

// ─── GET /api/users/:id  — public profile
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
      .select("displayName name orgName role skills availability location resourceType stats createdAt");
    if (!user || !user.isActive) return sendError(res, 404, "User not found.");
    return sendSuccess(res, 200, "Profile fetched.", { user });
  })
);

// ─── PATCH /api/users/:id/online  — toggle online status (private)
router.patch(
  "/:id/online",
  protect,
  asyncHandler(async (req, res) => {
    if (String(req.user._id) !== req.params.id) {
      return sendError(res, 403, "You can only update your own status.");
    }
    const { isOnline } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isOnline: Boolean(isOnline) },
      { new: true }
    );
    return sendSuccess(res, 200, "Online status updated.", { isOnline: user.isOnline });
  })
);

module.exports = router;

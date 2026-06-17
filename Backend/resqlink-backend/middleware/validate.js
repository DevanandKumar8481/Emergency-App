// middleware/validate.js
const { validationResult } = require("express-validator");
const { sendError }        = require("../utils/apiResponse");

/**
 * Run after express-validator chains.
 * If there are errors, return a 422 with field-level detail.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = {};
    errors.array().forEach((e) => {
      if (!formatted[e.path]) formatted[e.path] = e.msg;
    });
    return sendError(res, 422, "Validation failed", formatted);
  }
  next();
};

module.exports = { validate };

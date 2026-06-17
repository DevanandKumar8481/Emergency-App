
/**
 * Send a consistent success response.
 * @param {Response} res
 * @param {number}   statusCode
 * @param {string}   message
 * @param {object}   data
 */
const sendSuccess = (res, statusCode = 200, message = "Success", data = {}) =>
  res.status(statusCode).json({ success: true, message, data });

/**
 * Send a consistent error response.
 * @param {Response} res
 * @param {number}   statusCode
 * @param {string}   message
 * @param {object}   errors  — optional field-level errors
 */
const sendError = (res, statusCode = 500, message = "Something went wrong", errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};

module.exports = { sendSuccess, sendError };

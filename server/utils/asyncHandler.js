/**
 * Wrapper for async functions to catch errors and pass them to the global error handler.
 * Prevents the need for repetitive try-catch blocks in every controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
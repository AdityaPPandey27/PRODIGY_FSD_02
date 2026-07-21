const ErrorResponse = require('../utils/ErrorResponse');

/**
 * Global Error Handling Middleware
 * Catches all errors passed through next() and formats them into a standard JSON response.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for the developer
  console.log(err.stack);

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // 2. Mongoose Duplicate Key (Code 11000)
  if (err.code === 11000) {
    const message = 'Duplicate field value entered. This record already exists.';
    error = new ErrorResponse(message, 400);
  }

  // 3. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    // Extract all validation error messages and join them
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  // Send the formatted error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
/**
 * Custom Error class that extends the built-in Error object.
 * This allows us to attach a specific HTTP status code to our errors.
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
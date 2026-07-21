const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const Admin = require('../models/Admin');

/**
 * Protect routes middleware
 * Verifies the JWT token from cookies or authorization headers
 */
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if token exists in the Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 2. Fallback to checking cookies (more secure for web apps)
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the admin based on the ID stored in the token
    req.user = await Admin.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse('Admin not found with this token', 401));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});
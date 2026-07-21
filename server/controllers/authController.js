const Admin = require('../models/Admin');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

/**
 * Helper function to generate JWT, create a cookie, and send the response
 */
const sendTokenResponse = (admin, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevents client-side JS from accessing the cookie
  };

  // Secure cookie in production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
};

/**
 * @desc    Register a new admin (Useful for initial setup)
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  // Check for validation errors from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { name, email, password } = req.body;

  // Create admin
  const admin = await Admin.create({
    name,
    email,
    password,
  });

  sendTokenResponse(admin, 201, res);
});

/**
 * @desc    Login admin
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { email, password } = req.body;

  // Check if admin exists (we need to explicitly select password because we hid it in the model)
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches using the custom method we wrote in the model
  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(admin, 200, res);
});

/**
 * @desc    Log user out / clear cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // Expire in 10 seconds
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
    message: 'Logged out successfully',
  });
});

/**
 * @desc    Get current logged in admin
 * @route   GET /api/auth/profile
 * @access  Private
 */
exports.getProfile = asyncHandler(async (req, res, next) => {
  // req.user is set in our auth middleware
  const admin = await Admin.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: admin,
  });
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
exports.changePassword = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.user.id).select('+password');

  // Check current password
  if (!(await admin.matchPassword(currentPassword))) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  // Update password (the pre-save hook in the model will hash it automatically)
  admin.password = newPassword;
  await admin.save();

  sendTokenResponse(admin, 200, res);
});
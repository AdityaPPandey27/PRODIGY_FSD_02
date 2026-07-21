const express = require('express');
const { check } = require('express-validator');
const {
  register,
  login,
  logout,
  getProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Register Route
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  register
);

// Login Route
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

// Logout Route (Requires authentication)
router.get('/logout', protect, logout);

// Get Profile Route (Requires authentication)
router.get('/profile', protect, getProfile);

// Change Password Route (Requires authentication)
router.put(
  '/change-password',
  [
    protect,
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'Please enter a new password with 6 or more characters').isLength({ min: 6 }),
  ],
  changePassword
);

module.exports = router;
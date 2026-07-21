const express = require('express');
const { check } = require('express-validator');
const upload = require('../utils/fileUpload');
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All employee routes require authentication
router.use(protect);

router
  .route('/')
  .get(getEmployees)
  .post(
    upload.single('image'), // Middleware to handle file upload
    [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('phone', 'Phone number is required').not().isEmpty(),
      check('gender', 'Gender is required').isIn(['Male', 'Female', 'Other']),
      check('dob', 'Date of Birth is required').not().isEmpty(),
      check('department', 'Department is required').not().isEmpty(),
      check('designation', 'Designation is required').not().isEmpty(),
      check('salary', 'Salary must be a positive number').isFloat({ min: 0 }),
      check('address', 'Address is required').not().isEmpty(),
    ],
    createEmployee
  );

router
  .route('/:id')
  .get(getEmployeeById)
  .put(
    upload.single('image'),
    [
      check('email', 'Please include a valid email').optional().isEmail(),
      check('salary', 'Salary must be a positive number').optional().isFloat({ min: 0 }),
      check('gender', 'Invalid gender').optional().isIn(['Male', 'Female', 'Other']),
    ],
    updateEmployee
  )
  .delete(deleteEmployee);

module.exports = router;
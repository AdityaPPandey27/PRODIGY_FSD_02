const express = require('express');
const { check } = require('express-validator');
const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply the 'protect' middleware to all routes in this file
// Since managing departments should only be done by logged-in admins
router.use(protect);

router
  .route('/')
  .get(getDepartments)
  .post(
    [
      check('departmentName', 'Department name is required').not().isEmpty(),
      check('departmentName', 'Department name cannot exceed 50 characters').isLength({ max: 50 }),
    ],
    createDepartment
  );

router
  .route('/:id')
  .put(
    [
      check('departmentName', 'Department name cannot be empty if provided')
        .optional()
        .not()
        .isEmpty(),
    ],
    updateDepartment
  )
  .delete(deleteDepartment);

module.exports = router;
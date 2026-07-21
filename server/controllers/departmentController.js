const Department = require('../models/Department');
const Employee = require('../models/Employee'); // We need this to check for assigned employees
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all departments
 * @route   GET /api/departments
 * @access  Private
 */
exports.getDepartments = asyncHandler(async (req, res, next) => {
  // Fetch all departments and sort them alphabetically by name
  const departments = await Department.find().sort({ departmentName: 1 });

  res.status(200).json({
    success: true,
    count: departments.length,
    data: departments,
  });
});

/**
 * @desc    Create a new department
 * @route   POST /api/departments
 * @access  Private
 */
exports.createDepartment = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { departmentName, description } = req.body;

  const department = await Department.create({
    departmentName,
    description,
  });

  res.status(201).json({
    success: true,
    data: department,
  });
});

/**
 * @desc    Update a department
 * @route   PUT /api/departments/:id
 * @access  Private
 */
exports.updateDepartment = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  let department = await Department.findById(req.params.id);

  if (!department) {
    return next(new ErrorResponse(`Department not found with id of ${req.params.id}`, 404));
  }

  // Update the department. { new: true } returns the updated document, runValidators ensures schema rules apply
  department = await Department.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: department,
  });
});

/**
 * @desc    Delete a department
 * @route   DELETE /api/departments/:id
 * @access  Private
 */
exports.deleteDepartment = asyncHandler(async (req, res, next) => {
  const departmentId = req.params.id;

  const department = await Department.findById(departmentId);

  if (!department) {
    return next(new ErrorResponse(`Department not found with id of ${departmentId}`, 404));
  }

  // Best Practice: Data Integrity Check
  // Check if any employees are currently assigned to this department
  const employeesInDepartment = await Employee.countDocuments({ department: departmentId });

  if (employeesInDepartment > 0) {
    return next(
      new ErrorResponse(
        `Cannot delete department. There are ${employeesInDepartment} employee(s) assigned to it.`,
        400
      )
    );
  }

  // If no employees are assigned, proceed with deletion
  await department.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Department deleted successfully',
  });
});
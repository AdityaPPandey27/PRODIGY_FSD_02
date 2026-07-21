const Employee = require('../models/Employee');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Create new employee
 * @route   POST /api/employees
 * @access  Private
 */
exports.createEmployee = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const employeeData = { ...req.body };

  // If a file was uploaded, add the filename to the employee data
  if (req.file) {
    employeeData.image = req.file.filename;
  }

  const employee = await Employee.create(employeeData);

  res.status(201).json({
    success: true,
    data: employee,
  });
});

/**
 * @desc    Get all employees (with Search, Filter, Sort, Pagination)
 * @route   GET /api/employees
 * @access  Private
 */
exports.getEmployees = asyncHandler(async (req, res, next) => {
  let query;

  // 1. Copy req.query
  const reqQuery = { ...req.query };

  // 2. Fields to exclude from standard filtering (handled separately)
  const removeFields = ['search', 'sort', 'page', 'limit'];
  removeFields.forEach((param) => delete reqQuery[param]);

  // 3. Create query string for standard filters (e.g., status=Active, department=id)
  let queryStr = JSON.stringify(reqQuery);
  
  // Parse back to object to build the Mongoose query
  let parsedQuery = JSON.parse(queryStr);

  // 4. Search logic (Search by name or email)
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i'); // 'i' for case-insensitive
    parsedQuery.$or = [
      { name: searchRegex },
      { email: searchRegex }
    ];
  }

  // Initialize query and populate department details
  query = Employee.find(parsedQuery).populate('department', 'departmentName');

  // 5. Sorting logic
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt'); // Default sort by newest
  }

  // 6. Pagination logic
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // Execute query
  const employees = await query;

  // Count total documents for frontend pagination calculation
  const total = await Employee.countDocuments(parsedQuery);

  res.status(200).json({
    success: true,
    count: employees.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
    data: employees,
  });
});

/**
 * @desc    Get single employee
 * @route   GET /api/employees/:id
 * @access  Private
 */
exports.getEmployeeById = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id).populate(
    'department',
    'departmentName description'
  );

  if (!employee) {
    return next(new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: employee,
  });
});

/**
 * @desc    Update employee
 * @route   PUT /api/employees/:id
 * @access  Private
 */
exports.updateEmployee = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  let employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404));
  }

  const updateData = { ...req.body };

  // Handle new image upload
  if (req.file) {
    updateData.image = req.file.filename;

    // Optional Best Practice: Delete the old image file to save server space
    if (employee.image && employee.image !== 'default.jpg') {
      const oldImagePath = path.join(__dirname, '..', 'uploads', employee.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
  }

  employee = await Employee.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate('department', 'departmentName');

  res.status(200).json({
    success: true,
    data: employee,
  });
});

/**
 * @desc    Delete employee
 * @route   DELETE /api/employees/:id
 * @access  Private
 */
exports.deleteEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404));
  }

  // Delete associated image file to free up space
  if (employee.image && employee.image !== 'default.jpg') {
    const imagePath = path.join(__dirname, '..', 'uploads', employee.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await employee.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Employee deleted successfully',
  });
});
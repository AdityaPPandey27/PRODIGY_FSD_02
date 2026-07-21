const Employee = require('../models/Employee');
const Department = require('../models/Department');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get dashboard summary statistics and chart data
 * @route   GET /api/dashboard/summary
 * @access  Private
 */
exports.getDashboardSummary = asyncHandler(async (req, res, next) => {
  // 1. Basic Counts (executed in parallel for performance)
  const [
    totalEmployees,
    activeEmployees,
    inactiveEmployees,
    totalDepartments,
  ] = await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({ status: 'Active' }),
    Employee.countDocuments({ status: 'Inactive' }),
    Department.countDocuments(),
  ]);

  // 2. Chart Data: Employees by Department using Aggregation Pipeline
  const employeesByDepartment = await Employee.aggregate([
    {
      $group: {
        _id: '$department', // Group by the department ObjectId
        count: { $sum: 1 }, // Count the number of employees in each group
      },
    },
    {
      $lookup: {
        from: 'departments', // The collection name in MongoDB (usually pluralized and lowercase)
        localField: '_id',
        foreignField: '_id',
        as: 'departmentDetails',
      },
    },
    {
      $unwind: '$departmentDetails', // Deconstruct the array from the lookup
    },
    {
      $project: {
        _id: 0,
        departmentName: '$departmentDetails.departmentName',
        count: 1,
      },
    },
  ]);

  // 3. Chart Data: Monthly Joined Employees (Trend Line)
  const monthlyJoined = await Employee.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$joiningDate' },
          month: { $month: '$joiningDate' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }, // Sort chronologically
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        count: 1,
      },
    },
  ]);

  // Send the aggregated data
  res.status(200).json({
    success: true,
    data: {
      statistics: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        totalDepartments,
      },
      charts: {
        employeesByDepartment,
        monthlyJoined,
      },
    },
  });
});
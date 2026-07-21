const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
    gender: {
      type: String,
      required: [true, 'Please specify gender'],
      enum: ['Male', 'Female', 'Other'],
    },
    dob: {
      type: Date,
      required: [true, 'Please add Date of Birth'],
    },
    // Reference to the Department model
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Please assign a department'],
    },
    designation: {
      type: String,
      required: [true, 'Please add a designation'],
      trim: true,
    },
    salary: {
      type: Number,
      required: [true, 'Please add a salary'],
      min: [0, 'Salary must be a positive number'],
    },
    joiningDate: {
      type: Date,
      required: [true, 'Please add a joining date'],
      default: Date.now,
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    image: {
      type: String,
      default: 'default.jpg', // Will store the path to the uploaded image
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Employee', employeeSchema);
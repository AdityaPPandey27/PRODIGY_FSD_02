const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./middleware/error'); // Import global error handler

// Route files
const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Initialize Express app
const app = express();

// ==========================================
// Middleware Setup
// ==========================================

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// Mount Routes
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running smoothly!' });
});

// Mount Auth Routes
app.use('/api/auth', authRoutes);

// Mount Department Routes
app.use('/api/departments', departmentRoutes);

// Mount Employee Routes
app.use('/api/employees', employeeRoutes);

// Mount Dashboard Routes
app.use('/api/dashboard', dashboardRoutes);

// ==========================================
// Global Error Handler (MUST BE LAST MIDDLEWARE)
// ==========================================
app.use(errorHandler);

module.exports = app;
require('dotenv').config(); // Load environment variables first
const app = require('./app');
const connectDB = require('./config/db');

// Connect to the database
connectDB();

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections (e.g., failed database connection after initial load)
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
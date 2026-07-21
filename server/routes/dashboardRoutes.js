const express = require('express');
const { getDashboardSummary } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect the dashboard route so only logged-in admins can view analytics
router.use(protect);

router.get('/summary', getDashboardSummary);

module.exports = router;
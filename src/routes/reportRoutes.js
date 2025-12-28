const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.use(isAuthenticated);
router.get('/csv', reportController.exportCsv);
router.get('/monthly', reportController.monthlyReport);

module.exports = router;

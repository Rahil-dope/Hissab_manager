const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.use(isAuthenticated);
router.get('/', budgetController.getBudgets);
router.post('/', budgetController.setBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;

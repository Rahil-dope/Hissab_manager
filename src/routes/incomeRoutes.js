const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.use(isAuthenticated);
router.get('/', incomeController.getAllIncomes);
router.post('/', incomeController.addIncome);
router.delete('/:id', incomeController.deleteIncome);

module.exports = router;

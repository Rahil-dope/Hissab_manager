const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.use(isAuthenticated); // Protect all routes
router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.addCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;

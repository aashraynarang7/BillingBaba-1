const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/expenseCategoryController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, ctrl.createExpenseCategory);
router.get('/', protect, ctrl.getExpenseCategories);
router.delete('/:id', protect, ctrl.deleteExpenseCategory);

module.exports = router;

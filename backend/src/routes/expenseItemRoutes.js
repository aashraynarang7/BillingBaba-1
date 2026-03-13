const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/expenseItemController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, ctrl.createExpenseItem);
router.get('/', protect, ctrl.getExpenseItems);
router.put('/:id', protect, ctrl.updateExpenseItem);
router.delete('/:id', protect, ctrl.deleteExpenseItem);

module.exports = router;

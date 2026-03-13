const express = require('express');
const router = express.Router();
const paymentInController = require('../controllers/paymentInController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const uploadFields = upload.fields([
    { name: 'images', maxCount: 5 }
]);

router.post('/', protect, uploadFields, paymentInController.createPaymentIn);
router.get('/', protect, paymentInController.getPaymentIn);
router.get('/:id', protect, paymentInController.getPaymentInById);
router.put('/:id', protect, uploadFields, paymentInController.updatePaymentIn);
router.delete('/:id', protect, paymentInController.deletePaymentIn);

module.exports = router;

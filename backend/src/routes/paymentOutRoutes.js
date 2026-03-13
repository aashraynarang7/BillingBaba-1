const express = require('express');
const router = express.Router();
const paymentOutController = require('../controllers/paymentOutController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const uploadFields = upload.fields([
    { name: 'images', maxCount: 5 }
]);

router.post('/', protect, uploadFields, paymentOutController.createPaymentOut);
router.get('/', protect, paymentOutController.getPaymentOut);
router.get('/:id', protect, paymentOutController.getPaymentOutById);
router.put('/:id', protect, uploadFields, paymentOutController.updatePaymentOut);
router.delete('/:id', protect, paymentOutController.deletePaymentOut);

module.exports = router;

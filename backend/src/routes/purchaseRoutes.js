const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const upload = require('../middleware/uploadMiddleware');
const protect = require('../middleware/authMiddleware');

// Configure Multer for Create and Update
const uploadFields = upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'documents', maxCount: 5 }
]);

router.post('/', protect, uploadFields, purchaseController.createPurchase);
router.get('/', protect, purchaseController.getPurchases);
router.get('/:id', protect, purchaseController.getPurchaseById);
router.put('/:id', protect, uploadFields, purchaseController.updatePurchase);
// New Endpoint: Convert PO to  Bill
router.post('/:id/convert', protect, purchaseController.convertToBill);
router.post('/:id/return', protect, purchaseController.processReturn);
router.delete('/:id', protect, purchaseController.deletePurchase);
router.put('/:id/cancel', protect, purchaseController.cancelPurchase);

module.exports = router;

const express = require('express');
const router = express.Router();
const { createSale, getSales, getSaleById, updateSale, deleteSale, cancelSale, convertToInvoice, processReturn } = require('../controllers/saleController');
const upload = require('../middleware/uploadMiddleware');

const protect = require('../middleware/authMiddleware');

// Configure Multer for Create and Update
const uploadFields = upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'documents', maxCount: 5 }
]);

router.post('/', protect, uploadFields, createSale);
router.get('/', protect, getSales);
router.get('/:id', getSaleById);
router.put('/:id', uploadFields, updateSale);
router.delete('/:id', deleteSale);
router.put('/:id/cancel', cancelSale);
router.post('/:id/convert', convertToInvoice);
router.post('/:id/return', processReturn);

module.exports = router;

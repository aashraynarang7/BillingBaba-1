const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/barcodeController');

router.get('/lookup/:code', ctrl.lookupBarcode);

module.exports = router;

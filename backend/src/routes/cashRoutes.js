const express = require('express');
const router = express.Router();
const cashController = require('../controllers/cashController');

router.get('/transactions', cashController.getCashTransactions);

module.exports = router;

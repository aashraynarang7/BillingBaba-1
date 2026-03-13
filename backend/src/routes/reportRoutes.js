const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/profit-and-loss', reportController.getProfitAndLoss);
router.get('/:reportName', reportController.getReport);

module.exports = router;

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/dashboard-summary', reportController.getDashboardSummary);
router.get('/profit-and-loss', reportController.getProfitAndLoss);
router.get('/bill-wise-profit', reportController.getBillWiseProfit);
router.get('/:reportName', reportController.getReport);

module.exports = router;

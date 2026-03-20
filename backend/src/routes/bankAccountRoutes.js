const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bankAccountController');

router.get('/', ctrl.getBankAccounts);
router.post('/', ctrl.createBankAccount);
router.post('/transfer', ctrl.createBankTransfer);
router.put('/:id', ctrl.updateBankAccount);
router.delete('/:id', ctrl.deleteBankAccount);
router.get('/:id/transactions', ctrl.getBankTransactions);

module.exports = router;

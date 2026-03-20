const BankAccount = require('../models/BankAccount');
const BankTransfer = require('../models/BankTransfer');
const SaleInvoice = require('../models/SaleInvoice');
const Purchase = require('../models/Purchase');
const PaymentIn = require('../models/PaymentIn');
const PaymentOut = require('../models/PaymentOut');

// Get all bank accounts for a company with current balance
exports.getBankAccounts = async (req, res) => {
    try {
        const { companyId } = req.query;
        if (!companyId) return res.status(400).json({ error: 'companyId required' });

        const accounts = await BankAccount.find({ companyId }).lean();

        // For each account, compute current balance from transactions
        const accountsWithBalance = await Promise.all(accounts.map(async (acc) => {
            const balance = await computeBalance(acc);
            return { ...acc, currentBalance: balance };
        }));

        res.json(accountsWithBalance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create bank account
exports.createBankAccount = async (req, res) => {
    try {
        const account = new BankAccount(req.body);
        await account.save();
        res.status(201).json(account);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update bank account
exports.updateBankAccount = async (req, res) => {
    try {
        const account = await BankAccount.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!account) return res.status(404).json({ error: 'Not found' });
        res.json(account);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete bank account
exports.deleteBankAccount = async (req, res) => {
    try {
        await BankAccount.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get transactions for a specific bank account
exports.getBankTransactions = async (req, res) => {
    try {
        const { id } = req.params;
        const account = await BankAccount.findById(id).lean();
        if (!account) return res.status(404).json({ error: 'Not found' });

        const { companyId, accountName } = account;

        // Query all transaction types where paymentType or paymentMode matches account name
        const [sales, purchases, paymentsIn, paymentsOut, transfersOut, transfersIn] = await Promise.all([
            SaleInvoice.find({ companyId, paymentType: accountName }).populate('partyId', 'name').lean(),
            Purchase.find({ companyId, paymentType: accountName }).populate('partyId', 'name').lean(),
            PaymentIn.find({ companyId, paymentMode: accountName }).populate('partyId', 'name').lean(),
            PaymentOut.find({ companyId, paymentMode: accountName }).populate('partyId', 'name').lean(),
            BankTransfer.find({ companyId, fromAccount: accountName }).lean(),
            BankTransfer.find({ companyId, toAccount: accountName }).lean(),
        ]);

        const transactions = [
            ...sales.map(s => ({
                id: s._id, type: 'Sale',
                name: s.partyId?.name || s.partyName || 'Unknown',
                date: s.invoiceDate, amount: s.grandTotal, isIn: true
            })),
            ...purchases.map(p => ({
                id: p._id, type: 'Purchase',
                name: p.partyId?.name || p.partyName || 'Unknown',
                date: p.billDate, amount: p.grandTotal, isIn: false
            })),
            ...paymentsIn.map(p => ({
                id: p._id, type: 'Payment In',
                name: p.partyId?.name || 'Unknown',
                date: p.date, amount: p.amount, isIn: true
            })),
            ...paymentsOut.map(p => ({
                id: p._id, type: 'Payment Out',
                name: p.partyId?.name || 'Unknown',
                date: p.date, amount: p.amount, isIn: false
            })),
            ...transfersOut.map(t => ({
                id: t._id, type: 'Bank Transfer',
                name: `To: ${t.toAccount}`,
                date: t.date, amount: t.amount, isIn: false
            })),
            ...transfersIn.map(t => ({
                id: t._id, type: 'Bank Transfer',
                name: `From: ${t.fromAccount}`,
                date: t.date, amount: t.amount, isIn: true
            })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Opening balance entry
        const openingEntry = {
            id: 'opening', type: 'Opening Balance',
            name: 'Opening Balance',
            date: account.asOfDate, amount: account.openingBalance, isIn: account.openingBalance >= 0
        };

        const currentBalance = await computeBalance(account);

        res.json({ account: { ...account, currentBalance }, transactions: [...transactions, openingEntry] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/bank-accounts/transfer  — { companyId, fromAccount, toAccount, amount, date, description }
exports.createBankTransfer = async (req, res) => {
    try {
        const { companyId, fromAccount, toAccount, amount, date, description, imageUrl } = req.body;
        if (!companyId || !fromAccount || !toAccount || !amount)
            return res.status(400).json({ error: 'companyId, fromAccount, toAccount and amount are required' });
        if (fromAccount === toAccount)
            return res.status(400).json({ error: 'From and To accounts must be different' });

        const transfer = new BankTransfer({
            companyId,
            fromAccount,
            toAccount,
            amount: Number(amount),
            date: date ? new Date(date) : new Date(),
            description,
            imageUrl,
        });
        await transfer.save();
        res.status(201).json(transfer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Helper: compute current balance for an account
async function computeBalance(account) {
    const { companyId, accountName, openingBalance } = account;
    const [sales, purchases, paymentsIn, paymentsOut, transfersOut, transfersIn] = await Promise.all([
        SaleInvoice.aggregate([
            { $match: { companyId: account.companyId, paymentType: accountName } },
            { $group: { _id: null, total: { $sum: '$grandTotal' } } }
        ]),
        Purchase.aggregate([
            { $match: { companyId: account.companyId, paymentType: accountName } },
            { $group: { _id: null, total: { $sum: '$grandTotal' } } }
        ]),
        PaymentIn.aggregate([
            { $match: { companyId: account.companyId, paymentMode: accountName } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        PaymentOut.aggregate([
            { $match: { companyId: account.companyId, paymentMode: accountName } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        BankTransfer.aggregate([
            { $match: { companyId: account.companyId, fromAccount: accountName } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        BankTransfer.aggregate([
            { $match: { companyId: account.companyId, toAccount: accountName } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
    ]);

    const totalIn = (sales[0]?.total || 0) + (paymentsIn[0]?.total || 0) + (transfersIn[0]?.total || 0);
    const totalOut = (purchases[0]?.total || 0) + (paymentsOut[0]?.total || 0) + (transfersOut[0]?.total || 0);
    return (openingBalance || 0) + totalIn - totalOut;
}

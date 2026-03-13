const SaleInvoice = require('../models/SaleInvoice');
const PaymentIn = require('../models/PaymentIn');
const Purchase = require('../models/Purchase');
const PaymentOut = require('../models/PaymentOut');
const Party = require('../models/Party'); // If needed for population, but usually handled in find

const getCashTransactions = async (req, res) => {
    try {
        const { companyId, startDate, endDate } = req.query;
        
        if (!companyId) {
            return res.status(400).json({ error: "Company ID is required" });
        }

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.$gte = new Date(startDate);
            dateFilter.$lte = new Date(endDate);
        }

        // 1. Cash Sales
        const salesFilter = { 
            companyId, 
            paymentType: 'Cash' 
        };
        if (startDate && endDate) salesFilter.invoiceDate = dateFilter;

        const cashSales = await SaleInvoice.find(salesFilter)
            .populate('partyId', 'name')
            .lean();

        const formattedSales = cashSales.map(sale => ({
            id: sale._id,
            type: 'Sale',
            name: sale.partyId?.name || sale.partyName || 'Cash Sale',
            date: sale.invoiceDate,
            amount: sale.grandTotal, // Assuming full amount is cash for Cash Sales
            isIn: true
        }));

        // 2. Payment In (Cash)
        const paymentInFilter = { 
            companyId, 
            paymentMode: 'Cash' 
        };
        if (startDate && endDate) paymentInFilter.date = dateFilter;

        const cashPaymentIn = await PaymentIn.find(paymentInFilter)
            .populate('partyId', 'name')
            .lean();

        const formattedPaymentIn = cashPaymentIn.map(p => ({
            id: p._id,
            type: 'Payment-In',
            name: p.partyId?.name || 'Unknown Party',
            date: p.date,
            amount: p.amount,
            isIn: true
        }));

        // 3. Cash Purchases
        const purchaseFilter = { 
            companyId, 
            paymentType: 'Cash' 
        };
        if (startDate && endDate) purchaseFilter.billDate = dateFilter;

        const cashPurchases = await Purchase.find(purchaseFilter)
            .populate('partyId', 'name')
            .lean();

        const formattedPurchases = cashPurchases.map(p => ({
            id: p._id,
            type: 'Purchase',
            name: p.partyId?.name || p.partyName || 'Cash Purchase',
            date: p.billDate,
            amount: p.grandTotal,
            isIn: false
        }));

        // 4. Payment Out (Cash)
        const paymentOutFilter = { 
            companyId, 
            paymentMode: 'Cash' 
        };
        if (startDate && endDate) paymentOutFilter.date = dateFilter;

        const cashPaymentOut = await PaymentOut.find(paymentOutFilter)
            .populate('partyId', 'name')
            .lean();

        const formattedPaymentOut = cashPaymentOut.map(p => ({
            id: p._id,
            type: 'Payment-Out',
            name: p.partyId?.name || 'Unknown Party',
            date: p.date,
            amount: p.amount,
            isIn: false
        }));

        // Combine and Sort
        const allTransactions = [
            ...formattedSales,
            ...formattedPaymentIn,
            ...formattedPurchases,
            ...formattedPaymentOut
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Calculate Total Cash In Hand (Running Balance)
        // Note: If date filter is applied, this might only show balance for that period. 
        // Real Cash In Hand should be total accumulated. 
        // Ideally we fetch ALL transactions to calc total, but filter for list? 
        // For now, let's just calc totals based on fetched data or fetch totals separately.
        
        // Let's calculate TOTAL cash in hand regardless of date filter first.
        // Better implementation: Aggregation pipeline for totals.
        
        if (startDate && endDate) {
             // If filtered, the "Total Cash In Hand" displayed should probably still be the CURRENT actual cash in hand, 
             // but maybe we also want "Opening Balance" + "Period Change".
             // The UI usually shows "Cash In Hand" which is the current state.
        }

        // Let's get global totals for the company to show "Cash In Hand"
        const globalSalesTotal = await SaleInvoice.aggregate([
            { $match: { companyId: new mongoose.Types.ObjectId(companyId), paymentType: 'Cash' } },
            { $group: { _id: null, total: { $sum: "$grandTotal" } } }
        ]);
        const globalPaymentInTotal = await PaymentIn.aggregate([
             { $match: { companyId: new mongoose.Types.ObjectId(companyId), paymentMode: 'Cash' } },
             { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const globalPurchaseTotal = await Purchase.aggregate([
             { $match: { companyId: new mongoose.Types.ObjectId(companyId), paymentType: 'Cash' } },
             { $group: { _id: null, total: { $sum: "$grandTotal" } } }
        ]);
        const globalPaymentOutTotal = await PaymentOut.aggregate([
             { $match: { companyId: new mongoose.Types.ObjectId(companyId), paymentMode: 'Cash' } },
             { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalIn = (globalSalesTotal[0]?.total || 0) + (globalPaymentInTotal[0]?.total || 0);
        const totalOut = (globalPurchaseTotal[0]?.total || 0) + (globalPaymentOutTotal[0]?.total || 0);
        const cashInHand = totalIn - totalOut;

        res.json({
            cashInHand,
            transactions: allTransactions
        });

    } catch (error) {
        console.error("Get Cash Transactions Error:", error);
        res.status(500).json({ error: error.message });
    }
};

const mongoose = require('mongoose');

module.exports = {
    getCashTransactions
};

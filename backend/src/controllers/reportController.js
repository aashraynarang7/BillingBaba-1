const SaleInvoice = require('../models/SaleInvoice');
const Purchase = require('../models/Purchase');
const CreditNote = require('../models/CreditNote');
const DebitNote = require('../models/DebitNote');
const Product = require('../models/Product');
const Party = require('../models/Party');
const PaymentIn = require('../models/PaymentIn');
const PaymentOut = require('../models/PaymentOut');
const mongoose = require('mongoose');

// Helper to calculate P&L (Refactored from original to be reusable)
const calculateProfitAndLoss = async (filters) => {
    const { companyId, dateFilter } = filters;

    // --- 1. SALES (+) ---
    const salesFilter = { companyId };
    if (filters.startDate) salesFilter.invoiceDate = dateFilter; // reusing constructed dateFilter

    const sales = await SaleInvoice.find(salesFilter);
    const totalSales = sales.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);
    const gstPayable = sales.reduce((acc, curr) => acc + (curr.totalTax || 0), 0);

    // --- 2. CREDIT NOTES (-) ---
    const creditNoteFilter = { companyId };
    if (filters.startDate) creditNoteFilter.creditNoteDate = dateFilter;
    const creditNotes = await CreditNote.find(creditNoteFilter);
    const totalCreditNotes = creditNotes.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);

    // --- 3. PURCHASES (-) ---
    const purchaseFilter = { companyId, documentType: 'BILL', isBill: true };
    if (filters.startDate) purchaseFilter.billDate = dateFilter;
    const purchases = await Purchase.find(purchaseFilter);
    const totalPurchases = purchases.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);
    const gstReceivable = purchases.reduce((acc, curr) => acc + (curr.totalTax || 0), 0);

    // --- 4. PURCHASE RETURNS / DEBIT NOTES (+) ---
    const debitNoteFilter = { companyId };
    if (filters.startDate) debitNoteFilter.debitNoteDate = dateFilter;
    const debitNotes = await DebitNote.find(debitNoteFilter);
    const totalDebitNotes = debitNotes.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);

    const purchaseReturnFilter = { companyId, isReturn: true, documentType: 'BILL' };
    if (filters.startDate) purchaseReturnFilter.billDate = dateFilter;
    const purchaseReturns = await Purchase.find(purchaseReturnFilter);
    const totalPurchaseReturns = purchaseReturns.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);
    const totalReturnsPlus = totalDebitNotes + totalPurchaseReturns;

    // --- 5. DIRECT EXPENSES (-) ---
    const expenseFilter = { companyId, documentType: 'EXPENSE' };
    if (filters.startDate) expenseFilter.billDate = dateFilter;
    const expenses = await Purchase.find(expenseFilter);
    const totalDirectExpenses = expenses.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);

    // --- 6. PURCHASE FA (-) ---
    const faFilter = { companyId, documentType: 'FA' };
    if (filters.startDate) faFilter.billDate = dateFilter;
    const faPurchases = await Purchase.find(faFilter);
    const totalPurchaseFA = faPurchases.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);

    // --- 7. STOCK ---
    // Note: Stock is usually 'as of now' unless we track history.
    // For a specific date range, we ideally need historical stock. 
    // For now, we return current stock values.
    const products = await Product.find({ companyId });
    const closingStock = products.reduce((acc, curr) => acc + (curr.currentQuantity * (curr.purchasePrice?.amount || 0)), 0);
    const openingStock = products.reduce((acc, curr) => acc + (curr.openingQuantity * (curr.atPrice || 0)), 0);

    const grossValue = totalSales - totalCreditNotes + 0 - totalPurchases + totalReturnsPlus - totalPurchaseFA - totalDirectExpenses - gstPayable + gstReceivable - openingStock + closingStock;

    return {
        sale: totalSales,
        creditNote: totalCreditNotes,
        saleFA: 0,
        purchase: totalPurchases,
        debitNote: totalReturnsPlus,
        purchaseFA: totalPurchaseFA,
        directExpenses: totalDirectExpenses,
        otherDirectExpenses: 0,
        paymentInDiscount: 0,
        gstPayable: gstPayable,
        tcsPayable: 0,
        gstReceivable: gstReceivable,
        tcsReceivable: 0,
        openingStock: openingStock,
        closingStock: closingStock,
        indirectExpenses: 0,
        grossValue: grossValue,
        grossLabel: grossValue >= 0 ? "Gross Profit" : "Gross Loss"
    };
};

/*
    Generic Filter Runner
    reportName: 'sale', 'purchase', 'daybook', etc.
    filters: { companyId, startDate, endDate, ... }
*/
const runReportFilter = async (reportName, filters) => {
    const { companyId, dateFilter } = filters;

    switch (reportName) {
        case 'profit-and-loss':
            return await calculateProfitAndLoss(filters);

        case 'sale':
            // Return raw Sale documents
            // Supports filtering by date, maybe partyId later
            const saleQuery = { companyId };
            if (dateFilter) {
                // Check both invoiceDate (INVOICE) and orderDate (SO) or generally createdAt?
                // Usually Report 'Sale' implies 'Sale Invoices'.
                saleQuery.$or = [
                    { invoiceDate: dateFilter },
                    { orderDate: dateFilter }
                ];
            }
            return await SaleInvoice.find(saleQuery).populate('partyId', 'name').sort({ createdAt: -1 });

        case 'purchase':
            const purchaseQuery = { companyId };
            if (dateFilter) {
                purchaseQuery.$or = [
                    { billDate: dateFilter },
                    { orderDate: dateFilter }
                ];
            }
            return await Purchase.find(purchaseQuery).populate('partyId', 'name').sort({ createdAt: -1 });

        case 'day-book':
            // Day Book: All transactions for a specific day(s).
            // Sales, Purchases, Payments, etc.
            // Aggregating multiple collections.
            let dayBookData = [];

            if (dateFilter) {
                const sales = await SaleInvoice.find({ companyId, invoiceDate: dateFilter }).lean();
                const purchases = await Purchase.find({ companyId, billDate: dateFilter }).lean();
                // We'd also add PaymentIn, PaymentOut, Expenses...

                dayBookData = [
                    ...sales.map(s => ({ ...s, type: 'Sale', date: s.invoiceDate })),
                    ...purchases.map(p => ({ ...p, type: 'Purchase', date: p.billDate }))
                ].sort((a, b) => new Date(b.date) - new Date(a.date));
            }
            return dayBookData;

        case 'stock-summary':
            // Just list products with stock
            return await Product.find({ companyId }).select('name minStockToMaintain currentQuantity purchasePrice salePrice');

        case 'gstr-1':
            // Sales for GSTR-1 (B2B, B2C, etc.)
            return await SaleInvoice.find({ companyId });

        case 'gstr-2':
            // Purchases for GSTR-2
            return await Purchase.find({ companyId, documentType: 'BILL' });

        case 'all-parties':
            return await Party.find({ companyId });

        case 'sale-aging':
            let asOfDate2 = new Date();
            if (dateFilter) {
                if (dateFilter.$lte) asOfDate2 = new Date(dateFilter.$lte);
                else asOfDate2 = new Date(dateFilter);
            }
            asOfDate2.setHours(23, 59, 59, 999);

            const matchStage1 = {
                companyId: new mongoose.Types.ObjectId(companyId),
                invoiceDate: { $lte: asOfDate2 },
                balanceDue: { $gt: 0 },
                isReturn: false
            };

            const pipeline = [
                {
                    $match: matchStage1
                },
                {
                    $lookup: {
                        from: 'parties',
                        localField: 'partyId',
                        foreignField: '_id',
                        as: 'party'
                    }
                },
                {
                    $unwind: { path: '$party', preserveNullAndEmptyArrays: true }
                },
                // Add the partyGroup filter dynamically if requested
                ...(filters.partyGroup && filters.partyGroup !== 'ALL GROUPS' ? [{
                    $match: {
                        'party.partyGroup': filters.partyGroup
                    }
                }] : []),
                {
                    $addFields: {
                        refDate: { $ifNull: ['$dueDate', '$invoiceDate'] }
                    }
                },
                {
                    $addFields: {
                        daysDifference: {
                            $floor: {
                                $divide: [
                                    { $subtract: [asOfDate2, '$refDate'] },
                                    1000 * 60 * 60 * 24
                                ]
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: { $ifNull: ['$partyId', 'Cash'] },
                        partyName: { $first: { $ifNull: ['$party.name', 'Unknown/Cash'] } },
                        partyGroup: { $first: '$party.partyGroup' }, // If you have groups
                        current: {
                            $sum: { $cond: [{ $lte: ['$daysDifference', 0] }, '$balanceDue', 0] }
                        },
                        days1_30: {
                            $sum: { $cond: [{ $and: [{ $gt: ['$daysDifference', 0] }, { $lte: ['$daysDifference', 30] }] }, '$balanceDue', 0] }
                        },
                        days31_45: {
                            $sum: { $cond: [{ $and: [{ $gt: ['$daysDifference', 30] }, { $lte: ['$daysDifference', 45] }] }, '$balanceDue', 0] }
                        },
                        days46_60: {
                            $sum: { $cond: [{ $and: [{ $gt: ['$daysDifference', 45] }, { $lte: ['$daysDifference', 60] }] }, '$balanceDue', 0] }
                        },
                        over60: {
                            $sum: { $cond: [{ $gt: ['$daysDifference', 60] }, '$balanceDue', 0] }
                        },
                        total: { $sum: '$balanceDue' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        partyId: '$_id',
                        partyName: 1,
                        partyGroup: 1,
                        current: 1,
                        days1_30: 1,
                        days31_45: 1,
                        days46_60: 1,
                        over60: 1,
                        total: 1
                    }
                },
                { $sort: { partyName: 1 } }
            ];

            const partiesAging = await SaleInvoice.aggregate(pipeline);

            const summary = partiesAging.reduce((acc, curr) => {
                acc.current += curr.current;
                acc.days1_30 += curr.days1_30;
                acc.days31_45 += curr.days31_45;
                acc.days46_60 += curr.days46_60;
                acc.over60 += curr.over60;
                acc.totalOutstanding += curr.total;
                return acc;
            }, { current: 0, days1_30: 0, days31_45: 0, days46_60: 0, over60: 0, totalOutstanding: 0 });

            return {
                summary,
                parties: partiesAging
            };

        default:
            throw new Error(`Report '${reportName}' not found`);
    }
};

exports.getReport = async (req, res) => {
    try {
        const { reportName } = req.params;
        const { companyId, startDate, endDate, ...otherFilters } = req.query;

        if (!companyId) {
            return res.status(400).json({ error: "Company ID is required" });
        }

        const filters = {
            companyId,
            startDate,
            endDate,
            ...otherFilters
        };

        if (startDate && endDate) {
            filters.dateFilter = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const data = await runReportFilter(reportName, filters);
        res.json(data);

    } catch (error) {
        console.error(`Error fetching report ${req.params.reportName}:`, error);
        res.status(500).json({ error: error.message });
    }
};


// Keeping the original specific function if needed for backward compatibility, 
// or we can remove it if we update routes fully. 
// For now, let's keep it but make it use the shared logic if possible, or just leave as is.
// Actually, I'll replace it to use the shared logic to avoid duplication.
exports.getProfitAndLoss = async (req, res) => {
    try {
        const { companyId, startDate, endDate } = req.query;
        if (!companyId) return res.status(400).json({ error: "Company ID is required" });

        const filters = { companyId, startDate, endDate };
        if (startDate && endDate) {
            filters.dateFilter = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const data = await calculateProfitAndLoss(filters);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

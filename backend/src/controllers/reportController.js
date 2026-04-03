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

        case 'day-book': {
            const dbSaleFilter = { companyId, status: { $ne: 'Cancelled' } };
            const dbPurchFilter = { companyId, status: { $ne: 'Cancelled' } };
            const dbPayInFilter = { companyId };
            const dbPayOutFilter = { companyId };
            if (dateFilter) {
                dbSaleFilter.invoiceDate = dateFilter;
                dbPurchFilter.billDate = dateFilter;
                dbPayInFilter.date = dateFilter;
                dbPayOutFilter.date = dateFilter;
            }
            const [dbSales, dbPurchases, dbPayIns, dbPayOuts] = await Promise.all([
                SaleInvoice.find(dbSaleFilter).populate('partyId', 'name').lean(),
                Purchase.find(dbPurchFilter).populate('partyId', 'name').lean(),
                PaymentIn.find(dbPayInFilter).populate('partyId', 'name').lean(),
                PaymentOut.find(dbPayOutFilter).populate('partyId', 'name').lean(),
            ]);
            return [
                ...dbSales.map(s => ({
                    _id: s._id, type: 'Sale', refNo: s.invoiceNumber || '', date: s.invoiceDate,
                    partyName: s.partyId?.name || s.partyName || 'Cash',
                    total: s.grandTotal || 0, moneyIn: s.paidAmount || 0, moneyOut: 0,
                })),
                ...dbPurchases.map(p => ({
                    _id: p._id, type: p.documentType === 'EXPENSE' ? 'Expense' : 'Purchase',
                    refNo: p.billNumber || p.orderNumber || '', date: p.billDate || p.orderDate,
                    partyName: p.partyId?.name || p.partyName || '',
                    total: p.grandTotal || 0, moneyIn: 0, moneyOut: p.paidAmount || 0,
                })),
                ...dbPayIns.map(pi => ({
                    _id: pi._id, type: 'Payment In', refNo: pi.receiptNumber || '', date: pi.date,
                    partyName: pi.partyId?.name || pi.partyName || '',
                    total: pi.amount || 0, moneyIn: pi.amount || 0, moneyOut: 0,
                })),
                ...dbPayOuts.map(po => ({
                    _id: po._id, type: 'Payment Out', refNo: po.receiptNumber || '', date: po.date,
                    partyName: po.partyId?.name || po.partyName || '',
                    total: po.amount || 0, moneyIn: 0, moneyOut: po.amount || 0,
                })),
            ].sort((a, b) => new Date(b.date) - new Date(a.date));
        }

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

        case 'party-statement': {
            const { partyId } = filters;
            if (!partyId) return [];
            const psDateSale = dateFilter ? { invoiceDate: dateFilter } : {};
            const psDatePurch = dateFilter ? { billDate: dateFilter } : {};
            const psDatePay = dateFilter ? { date: dateFilter } : {};
            const [psSales, psPurchases, psPayIns, psPayOuts, psCreditNotes, psDebitNotes] = await Promise.all([
                SaleInvoice.find({ companyId, partyId, ...psDateSale }).lean(),
                Purchase.find({ companyId, partyId, ...psDatePurch }).lean(),
                PaymentIn.find({ companyId, partyId, ...psDatePay }).lean(),
                PaymentOut.find({ companyId, partyId, ...psDatePay }).lean(),
                CreditNote.find({ companyId, partyId, ...(dateFilter ? { creditNoteDate: dateFilter } : {}) }).lean(),
                DebitNote.find({ companyId, partyId, ...(dateFilter ? { debitNoteDate: dateFilter } : {}) }).lean(),
            ]);
            const txns = [
                ...psSales.map(s => ({ _id: s._id, type: 'Sale', refNo: s.invoiceNumber, date: s.invoiceDate, total: s.grandTotal || 0, debit: s.grandTotal || 0, credit: s.paidAmount || 0 })),
                ...psPurchases.map(p => ({ _id: p._id, type: 'Purchase', refNo: p.billNumber, date: p.billDate, total: p.grandTotal || 0, debit: p.paidAmount || 0, credit: p.grandTotal || 0 })),
                ...psPayIns.map(pi => ({ _id: pi._id, type: 'Payment In', refNo: pi.receiptNumber, date: pi.date, total: pi.amount || 0, debit: 0, credit: pi.amount || 0 })),
                ...psPayOuts.map(po => ({ _id: po._id, type: 'Payment Out', refNo: po.receiptNumber, date: po.date, total: po.amount || 0, debit: po.amount || 0, credit: 0 })),
                ...psCreditNotes.map(cn => ({ _id: cn._id, type: 'Credit Note', refNo: cn.creditNoteNumber, date: cn.creditNoteDate, total: cn.grandTotal || 0, debit: 0, credit: cn.grandTotal || 0 })),
                ...psDebitNotes.map(dn => ({ _id: dn._id, type: 'Debit Note', refNo: dn.debitNoteNumber, date: dn.debitNoteDate, total: dn.grandTotal || 0, debit: dn.grandTotal || 0, credit: 0 })),
            ].sort((a, b) => new Date(a.date) - new Date(b.date));
            // Running balance
            let bal = 0;
            txns.forEach(t => { bal += (t.debit - t.credit); t.balance = bal; });
            return { transactions: txns, closingBalance: bal };
        }

        case 'sale-purchase-by-party': {
            const spSaleFilter = { companyId, status: { $ne: 'Cancelled' } };
            const spPurchFilter = { companyId, documentType: 'BILL', status: { $ne: 'Cancelled' } };
            if (dateFilter) { spSaleFilter.invoiceDate = dateFilter; spPurchFilter.billDate = dateFilter; }
            const [spSales, spPurchases] = await Promise.all([
                SaleInvoice.find(spSaleFilter).lean(),
                Purchase.find(spPurchFilter).lean(),
            ]);
            const partyMap = {};
            const allParties = await Party.find({ companyId }).select('name partyGroup').lean();
            allParties.forEach(p => { partyMap[p._id.toString()] = { name: p.name, group: p.partyGroup || 'General', saleAmount: 0, purchaseAmount: 0 }; });
            spSales.forEach(s => {
                const pid = s.partyId?.toString();
                if (pid && partyMap[pid]) partyMap[pid].saleAmount += (s.grandTotal || 0);
            });
            spPurchases.forEach(p => {
                const pid = p.partyId?.toString();
                if (pid && partyMap[pid]) partyMap[pid].purchaseAmount += (p.grandTotal || 0);
            });
            return Object.entries(partyMap)
                .filter(([, v]) => v.saleAmount > 0 || v.purchaseAmount > 0)
                .map(([id, v]) => ({ partyId: id, ...v }));
        }

        case 'sale-purchase-by-party-group': {
            const spgData = await runReportFilter('sale-purchase-by-party', filters);
            const groupMap = {};
            spgData.forEach(p => {
                const g = p.group || 'General';
                if (!groupMap[g]) groupMap[g] = { group: g, saleAmount: 0, purchaseAmount: 0 };
                groupMap[g].saleAmount += p.saleAmount;
                groupMap[g].purchaseAmount += p.purchaseAmount;
            });
            return Object.values(groupMap);
        }

        case 'item-detail': {
            const { itemName } = filters;
            const idSaleFilter = { companyId, status: { $ne: 'Cancelled' } };
            const idPurchFilter = { companyId, status: { $ne: 'Cancelled' } };
            if (dateFilter) { idSaleFilter.invoiceDate = dateFilter; idPurchFilter.billDate = dateFilter; }
            const [idSales, idPurchases] = await Promise.all([
                SaleInvoice.find(idSaleFilter).lean(),
                Purchase.find(idPurchFilter).lean(),
            ]);
            // Group by item, compute daily movements
            const itemMap = {};
            idSales.forEach(s => {
                (s.items || []).forEach(i => {
                    if (itemName && !i.name?.toLowerCase().includes(itemName.toLowerCase())) return;
                    const key = i.name || 'Unknown';
                    if (!itemMap[key]) itemMap[key] = [];
                    itemMap[key].push({ date: s.invoiceDate, saleQty: i.quantity || 0, purchaseQty: 0, type: 'Sale' });
                });
            });
            idPurchases.forEach(p => {
                (p.items || []).forEach(i => {
                    if (itemName && !i.name?.toLowerCase().includes(itemName.toLowerCase())) return;
                    const key = i.name || 'Unknown';
                    if (!itemMap[key]) itemMap[key] = [];
                    itemMap[key].push({ date: p.billDate, saleQty: 0, purchaseQty: i.quantity || 0, type: 'Purchase' });
                });
            });
            // Sort each item's entries by date
            Object.values(itemMap).forEach(arr => arr.sort((a, b) => new Date(a.date) - new Date(b.date)));
            return itemMap;
        }

        case 'item-wise-discount': {
            const iwdFilter = { companyId, status: { $ne: 'Cancelled' } };
            if (dateFilter) iwdFilter.invoiceDate = dateFilter;
            const iwdSales = await SaleInvoice.find(iwdFilter).lean();
            const discountMap = {};
            iwdSales.forEach(s => {
                (s.items || []).forEach(i => {
                    const key = i.name || 'Unknown';
                    if (!discountMap[key]) discountMap[key] = { name: key, totalQty: 0, saleAmount: 0, discountAmount: 0 };
                    discountMap[key].totalQty += (i.quantity || 0);
                    discountMap[key].saleAmount += (i.amount || 0);
                    discountMap[key].discountAmount += (i.discount?.amount || 0);
                });
            });
            return Object.values(discountMap).map(d => ({
                ...d,
                avgDiscountPercent: d.saleAmount > 0 ? ((d.discountAmount / (d.saleAmount + d.discountAmount)) * 100) : 0,
            }));
        }

        case 'low-stock-summary': {
            const lsProducts = await Product.find({ companyId }).select('name currentQuantity minStockToMaintain purchasePrice category').lean();
            return lsProducts
                .filter(p => (p.currentQuantity ?? 0) <= 0 || (p.minStockToMaintain > 0 && (p.currentQuantity ?? 0) <= p.minStockToMaintain))
                .map(p => ({
                    name: p.name,
                    category: p.category || '',
                    currentQuantity: p.currentQuantity || 0,
                    minStockToMaintain: p.minStockToMaintain,
                    stockValue: (p.currentQuantity || 0) * (p.purchasePrice?.amount || 0),
                }));
        }

        case 'sale-purchase-by-item-category': {
            const catSaleFilter = { companyId, status: { $ne: 'Cancelled' } };
            const catPurchFilter = { companyId, documentType: 'BILL', status: { $ne: 'Cancelled' } };
            if (dateFilter) { catSaleFilter.invoiceDate = dateFilter; catPurchFilter.billDate = dateFilter; }
            const [catSales, catPurchases] = await Promise.all([
                SaleInvoice.find(catSaleFilter).lean(),
                Purchase.find(catPurchFilter).lean(),
            ]);
            // Build item->category mapping from products
            const catProducts = await Product.find({ companyId }).select('name category').lean();
            const itemCatMap = {};
            catProducts.forEach(p => { if (p.name) itemCatMap[p.name.toLowerCase()] = p.category || 'Uncategorized'; });
            const categoryMap = {};
            catSales.forEach(s => {
                (s.items || []).forEach(i => {
                    const cat = itemCatMap[i.name?.toLowerCase()] || 'Uncategorized';
                    if (!categoryMap[cat]) categoryMap[cat] = { category: cat, saleQty: 0, saleAmount: 0, purchaseQty: 0, purchaseAmount: 0 };
                    categoryMap[cat].saleQty += (i.quantity || 0);
                    categoryMap[cat].saleAmount += (i.amount || 0);
                });
            });
            catPurchases.forEach(p => {
                (p.items || []).forEach(i => {
                    const cat = itemCatMap[i.name?.toLowerCase()] || 'Uncategorized';
                    if (!categoryMap[cat]) categoryMap[cat] = { category: cat, saleQty: 0, saleAmount: 0, purchaseQty: 0, purchaseAmount: 0 };
                    categoryMap[cat].purchaseQty += (i.quantity || 0);
                    categoryMap[cat].purchaseAmount += (i.amount || 0);
                });
            });
            return Object.values(categoryMap);
        }

        case 'trial-balance': {
            const BankAccount = require('../models/BankAccount');
            const tbParties = await Party.find({ companyId }).select('name currentBalance partyType').lean();
            const tbProducts = await Product.find({ companyId }).select('name currentQuantity purchasePrice openingQuantity atPrice').lean();
            const tbBanks = await BankAccount.find({ companyId }).select('accountName openingBalance').lean();

            // Sales & purchases totals
            const tbSaleFilter = { companyId, status: { $ne: 'Cancelled' } };
            const tbPurchFilter = { companyId, status: { $ne: 'Cancelled' } };
            const tbExpFilter = { companyId, documentType: 'EXPENSE', status: { $ne: 'Cancelled' } };
            if (dateFilter) { tbSaleFilter.invoiceDate = dateFilter; tbPurchFilter.billDate = dateFilter; tbExpFilter.billDate = dateFilter; }
            const [tbSales, tbPurchases, tbExpenses] = await Promise.all([
                SaleInvoice.find(tbSaleFilter).lean(),
                Purchase.find(tbPurchFilter).lean(),
                Purchase.find(tbExpFilter).lean(),
            ]);
            const totalSalesTB = tbSales.reduce((s, i) => s + (i.grandTotal || 0), 0);
            const totalPurchasesTB = tbPurchases.reduce((s, i) => s + (i.grandTotal || 0), 0);
            const totalExpensesTB = tbExpenses.reduce((s, i) => s + (i.grandTotal || 0), 0);
            const totalGstPayable = tbSales.reduce((s, i) => s + (i.totalTax || 0), 0);
            const totalGstReceivable = tbPurchases.reduce((s, i) => s + (i.totalTax || 0), 0);

            let totalReceivable = 0, totalPayable = 0;
            tbParties.forEach(p => {
                const b = p.currentBalance || 0;
                if (b > 0) totalReceivable += b;
                else totalPayable += Math.abs(b);
            });

            const closingStockTB = tbProducts.reduce((s, p) => s + ((p.currentQuantity || 0) * (p.purchasePrice?.amount || 0)), 0);
            const openingStockTB = tbProducts.reduce((s, p) => s + ((p.openingQuantity || 0) * (p.atPrice || 0)), 0);
            const bankBalance = tbBanks.reduce((s, b) => s + (b.openingBalance || 0), 0);

            return {
                assets: [
                    { name: 'Sundry Debtors', debit: totalReceivable, credit: 0, children: tbParties.filter(p => (p.currentBalance || 0) > 0).map(p => ({ name: p.name, debit: p.currentBalance, credit: 0 })) },
                    { name: 'Closing Stock', debit: closingStockTB, credit: 0 },
                    { name: 'Bank Accounts', debit: bankBalance > 0 ? bankBalance : 0, credit: bankBalance < 0 ? Math.abs(bankBalance) : 0, children: tbBanks.map(b => ({ name: b.accountName, debit: b.openingBalance > 0 ? b.openingBalance : 0, credit: b.openingBalance < 0 ? Math.abs(b.openingBalance) : 0 })) },
                ],
                incomes: [
                    { name: 'Sales', debit: 0, credit: totalSalesTB },
                ],
                expenses: [
                    { name: 'Purchases', debit: totalPurchasesTB, credit: 0 },
                    { name: 'Direct Expenses', debit: totalExpensesTB, credit: 0 },
                ],
                liabilities: [
                    { name: 'Sundry Creditors', debit: 0, credit: totalPayable, children: tbParties.filter(p => (p.currentBalance || 0) < 0).map(p => ({ name: p.name, debit: 0, credit: Math.abs(p.currentBalance) })) },
                    { name: 'GST Payable', debit: 0, credit: totalGstPayable },
                    { name: 'GST Receivable', debit: totalGstReceivable, credit: 0 },
                ],
                totals: {
                    totalDebit: totalReceivable + closingStockTB + (bankBalance > 0 ? bankBalance : 0) + totalPurchasesTB + totalExpensesTB + totalGstReceivable,
                    totalCredit: totalPayable + totalSalesTB + totalGstPayable + (bankBalance < 0 ? Math.abs(bankBalance) : 0),
                },
            };
        }

        case 'balance-sheet': {
            const tbData = await runReportFilter('trial-balance', filters);
            const assetTotal = tbData.assets.reduce((s, a) => s + (a.debit - a.credit), 0);
            const liabilityTotal = tbData.liabilities.reduce((s, l) => s + (l.credit - l.debit), 0);
            const incomeTotal = tbData.incomes.reduce((s, i) => s + (i.credit - i.debit), 0);
            const expenseTotal = tbData.expenses.reduce((s, e) => s + (e.debit - e.credit), 0);
            const netProfit = incomeTotal - expenseTotal;
            return {
                assets: {
                    items: tbData.assets,
                    total: assetTotal,
                },
                liabilities: {
                    items: [
                        ...tbData.liabilities,
                        { name: netProfit >= 0 ? 'Net Profit' : 'Net Loss', debit: netProfit < 0 ? Math.abs(netProfit) : 0, credit: netProfit >= 0 ? netProfit : 0 },
                    ],
                    total: liabilityTotal + netProfit,
                },
            };
        }

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
exports.getBillWiseProfit = async (req, res) => {
    try {
        const { companyId, startDate, endDate, party } = req.query;
        if (!companyId) return res.status(400).json({ error: 'Company ID is required' });

        const Item = require('../models/Item');

        const filter = { companyId, status: { $ne: 'Cancelled' } };
        if (startDate && endDate) {
            filter.invoiceDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (party) {
            filter.$or = [
                { partyName: { $regex: party, $options: 'i' } }
            ];
        }

        const invoices = await SaleInvoice.find(filter).lean();

        // Collect all itemIds and fetch Items with Product populated
        const allItemIds = invoices.flatMap(inv => inv.items.map(i => i.itemId).filter(Boolean));
        const uniqueIds = [...new Set(allItemIds.map(id => id.toString()))];
        const itemDocs = await Item.find({ _id: { $in: uniqueIds } }).populate('product').lean();
        const itemMap = {};
        itemDocs.forEach(doc => { itemMap[doc._id.toString()] = doc; });

        const result = invoices.map(inv => {
            const itemBreakdown = inv.items.map(lineItem => {
                const itemDoc = lineItem.itemId ? itemMap[lineItem.itemId.toString()] : null;
                const purchasePrice = itemDoc?.product?.purchasePrice?.amount || 0;
                const totalCost = purchasePrice * (lineItem.quantity || 1);
                return {
                    name: lineItem.name,
                    quantity: lineItem.quantity || 1,
                    purchasePrice,
                    totalCost,
                };
            });

            const totalItemCost = itemBreakdown.reduce((s, i) => s + i.totalCost, 0);
            const taxPayable = inv.totalTax || 0;
            const tdsReceivable = inv.tdsAmount || 0;
            const saleAmount = inv.grandTotal || 0;
            const profit = saleAmount - totalItemCost - taxPayable + tdsReceivable;

            return {
                _id: inv._id,
                invoiceNumber: inv.invoiceNumber,
                invoiceDate: inv.invoiceDate,
                partyName: inv.partyName || 'Cash Sale',
                saleAmount,
                totalItemCost,
                taxPayable,
                tdsReceivable,
                profit,
                items: itemBreakdown,
            };
        });

        // Sort by date desc
        result.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate));

        res.json(result);
    } catch (error) {
        console.error('getBillWiseProfit error:', error);
        res.status(500).json({ error: error.message });
    }
};

// --- Dashboard Summary ---
exports.getDashboardSummary = async (req, res) => {
    try {
        const { companyId } = req.query;
        if (!companyId) return res.status(400).json({ error: 'Company ID is required' });

        const BankAccount = require('../models/BankAccount');
        const SaleOrder = require('../models/SaleOrder');
        const Estimate = require('../models/Estimate');

        // Run all queries in parallel
        const [parties, recentSales, recentPurchases, recentOrders, recentEstimates, products, bankAccounts] = await Promise.all([
            // All parties for receivable/payable
            Party.find({ companyId }).select('name currentBalance partyType').lean(),
            // Recent 10 sale invoices
            SaleInvoice.find({ companyId, status: { $ne: 'Cancelled' } })
                .sort({ createdAt: -1 }).limit(10).populate('partyId', 'name').lean(),
            // Recent 10 purchases
            Purchase.find({ companyId, documentType: 'BILL', status: { $ne: 'Cancelled' } })
                .sort({ createdAt: -1 }).limit(10).populate('partyId', 'name').lean(),
            // Recent sale orders (not converted)
            SaleOrder.find({ companyId, status: { $nin: ['Cancelled', 'CONVERTED'] } })
                .sort({ createdAt: -1 }).limit(10).populate('partyId', 'name').lean(),
            // Recent estimates
            (mongoose.models.Estimate ? mongoose.models.Estimate : mongoose.model('Estimate', new mongoose.Schema({}, { strict: false })))
                .find({ companyId }).sort({ createdAt: -1 }).limit(5).lean().catch(() => []),
            // Products for stock
            Product.find({ companyId }).select('name currentQuantity minStockToMaintain purchasePrice salePrice').lean(),
            // Bank accounts
            BankAccount.find({ companyId }).select('accountName openingBalance').lean(),
        ]);

        // --- Receivable / Payable from party balances ---
        let totalReceivable = 0;
        let receivablePartyCount = 0;
        let totalPayable = 0;
        let payablePartyCount = 0;

        parties.forEach(p => {
            const bal = p.currentBalance || 0;
            if (bal > 0) { totalReceivable += bal; receivablePartyCount++; }
            else if (bal < 0) { totalPayable += Math.abs(bal); payablePartyCount++; }
        });

        // --- Today's sales & purchases ---
        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);

        const todaySales = recentSales
            .filter(s => s.invoiceDate && new Date(s.invoiceDate) >= todayStart && new Date(s.invoiceDate) <= todayEnd)
            .reduce((sum, s) => sum + (s.grandTotal || 0), 0);

        const todayPurchases = recentPurchases
            .filter(p => p.billDate && new Date(p.billDate) >= todayStart && new Date(p.billDate) <= todayEnd)
            .reduce((sum, p) => sum + (p.grandTotal || 0), 0);

        // --- Stock value & low stock ---
        let stockValue = 0;
        const lowStockItems = [];
        products.forEach(p => {
            stockValue += (p.currentQuantity || 0) * (p.purchasePrice?.amount || 0);
            if (p.minStockToMaintain > 0 && p.currentQuantity <= p.minStockToMaintain) {
                lowStockItems.push({ name: p.name, currentQuantity: p.currentQuantity, minStock: p.minStockToMaintain });
            }
        });

        // --- Bank balance ---
        const totalBankBalance = bankAccounts.reduce((sum, a) => sum + (a.openingBalance || 0), 0);

        // --- Recent orders mapped ---
        const orders = recentOrders.map(o => ({
            id: o._id,
            name: o.partyId?.name || o.partyName || 'Unknown',
            items: o.items?.length || 0,
            amount: o.grandTotal || 0,
            status: o.status === 'CONVERTED' ? 'Delivered' : 'Open',
            date: o.orderDate || o.createdAt,
        }));

        // Merge estimates into orders list
        recentEstimates.forEach(e => {
            orders.push({
                id: e._id,
                name: e.partyId?.name || e.partyName || 'Unknown',
                items: e.items?.length || 0,
                amount: e.grandTotal || 0,
                status: 'Estimate',
                date: e.estimateDate || e.createdAt,
            });
        });

        // Sort by date desc
        orders.sort((a, b) => new Date(b.date) - new Date(a.date));

        // --- Total purchases & expenses (all time) ---
        const totalPurchasesAmount = recentPurchases.reduce((s, p) => s + (p.grandTotal || 0), 0);

        res.json({
            totalReceivable,
            receivablePartyCount,
            totalPayable,
            payablePartyCount,
            todaySales,
            todayPurchases,
            stockValue,
            lowStockItems,
            totalBankBalance,
            totalPurchases: totalPurchasesAmount,
            orders: orders.slice(0, 10),
            recentSales: recentSales.slice(0, 5).map(s => ({
                id: s._id,
                invoiceNumber: s.invoiceNumber,
                partyName: s.partyId?.name || s.partyName || 'Cash',
                amount: s.grandTotal || 0,
                balance: s.balanceDue || 0,
                status: s.status,
                date: s.invoiceDate,
            })),
        });
    } catch (error) {
        console.error('getDashboardSummary error:', error);
        res.status(500).json({ error: error.message });
    }
};

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

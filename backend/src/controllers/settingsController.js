const Settings = require('../models/Settings');

// GET /api/settings?companyId=
// Returns settings for the company, creating defaults on first access
exports.getSettings = async (req, res) => {
    try {
        const { companyId } = req.query;
        if (!companyId) return res.status(400).json({ error: 'companyId required' });

        let settings = await Settings.findOne({ companyId });
        if (!settings) {
            settings = await Settings.create({ companyId });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/settings?companyId=
// Partial update — only the fields sent are updated
exports.updateSettings = async (req, res) => {
    try {
        const { companyId } = req.query;
        if (!companyId) return res.status(400).json({ error: 'companyId required' });

        const allowed = [
            // General
            'enablePasscode', 'businessCurrency', 'amountDecimalPlaces',
            'showGSTIN', 'stopSaleOnNegativeStock', 'blockNewItemsFromTxn', 'blockNewPartiesFromTxn',
            'showEstimate', 'showProformaInvoice', 'showSalePurchaseOrder',
            'showOtherIncome', 'showFixedAssets', 'showDeliveryChallan',
            'goodsReturnOnDeliveryChallan', 'printAmountInDeliveryChallan',
            'enableGodownManagement', 'autoBackup', 'auditTrail', 'zoomLevel', 'multiFirmEnabled',
            // Transaction Header
            'txnInvoiceBillNo', 'txnAddTime', 'txnPrintTime', 'txnCashSaleDefault',
            'txnBillingNameOfParties', 'txnCustomerPODetails',
            // Items Table
            'txnInclusiveExclusiveTax', 'txnDisplayPurchasePrice', 'txnShowLast5SalePrice',
            'txnFreeItemQuantity', 'txnCount',
            // Taxes, Discount & Totals
            'txnTransactionWiseTax', 'txnTransactionWiseDiscount',
            'txnRoundOffTotal', 'txnRoundOffDirection', 'txnRoundOffTo',
            // More Transaction Features
            'txnEwayBillNo', 'txnQuickEntry', 'txnNoInvoicePreview', 'txnPasscodeForEditDelete',
            'txnDiscountDuringPayments', 'txnLinkPayments', 'txnDueDatesPaymentTerms', 'txnShowProfitOnSale',
            // Transaction Prefixes
            'txnPrefixSale', 'txnPrefixCreditNote', 'txnPrefixSaleOrder', 'txnPrefixPurchaseOrder',
            'txnPrefixEstimate', 'txnPrefixProformaInvoice', 'txnPrefixDeliveryChallan',
            'txnPrefixPaymentIn', 'txnPrefixSaleFixedAsset', 'txnCustomPrefixes',
            // Billing Type
            'txnBillingType',
        ];

        const updates = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }
        updates.updatedAt = new Date();

        const settings = await Settings.findOneAndUpdate(
            { companyId },
            { $set: updates },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

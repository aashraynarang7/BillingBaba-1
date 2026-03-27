const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        unique: true,
    },

    // Application
    enablePasscode: { type: Boolean, default: false },
    businessCurrency: { type: String, default: '₹' },
    amountDecimalPlaces: { type: Number, default: 2, min: 0, max: 4 },
    showGSTIN: { type: Boolean, default: true },
    stopSaleOnNegativeStock: { type: Boolean, default: false },
    blockNewItemsFromTxn: { type: Boolean, default: false },
    blockNewPartiesFromTxn: { type: Boolean, default: false },

    // More Transactions
    showEstimate: { type: Boolean, default: true },
    showProformaInvoice: { type: Boolean, default: true },
    showSalePurchaseOrder: { type: Boolean, default: true },
    showOtherIncome: { type: Boolean, default: true },
    showFixedAssets: { type: Boolean, default: true },
    showDeliveryChallan: { type: Boolean, default: true },
    goodsReturnOnDeliveryChallan: { type: Boolean, default: true },
    printAmountInDeliveryChallan: { type: Boolean, default: false },

    // Stock Transfer
    enableGodownManagement: { type: Boolean, default: false },

    // Backup & History
    autoBackup: { type: Boolean, default: false },
    lastBackupAt: { type: Date, default: null },
    auditTrail: { type: Boolean, default: true },

    // View
    zoomLevel: { type: Number, default: 100 },

    // Multi Firm
    multiFirmEnabled: { type: Boolean, default: false },

    // ── Transaction Header ───────────────────────────────────────────
    txnInvoiceBillNo: { type: Boolean, default: true },
    txnAddTime: { type: Boolean, default: false },
    txnPrintTime: { type: Boolean, default: false },
    txnCashSaleDefault: { type: Boolean, default: false },
    txnBillingNameOfParties: { type: Boolean, default: false },
    txnCustomerPODetails: { type: Boolean, default: false },

    // ── Items Table ──────────────────────────────────────────────────
    txnInclusiveExclusiveTax: { type: Boolean, default: true },
    txnDisplayPurchasePrice: { type: Boolean, default: true },
    txnShowLast5SalePrice: { type: Boolean, default: false },
    txnFreeItemQuantity: { type: Boolean, default: false },
    txnCount: { type: Boolean, default: false },

    // ── Taxes, Discount & Totals ─────────────────────────────────────
    txnTransactionWiseTax: { type: Boolean, default: false },
    txnTransactionWiseDiscount: { type: Boolean, default: false },
    txnRoundOffTotal: { type: Boolean, default: true },
    txnRoundOffDirection: { type: String, default: 'Nearest' },
    txnRoundOffTo: { type: Number, default: 1 },

    // ── More Transaction Features ────────────────────────────────────
    txnEwayBillNo: { type: Boolean, default: false },
    txnQuickEntry: { type: Boolean, default: false },
    txnNoInvoicePreview: { type: Boolean, default: false },
    txnPasscodeForEditDelete: { type: Boolean, default: false },
    txnDiscountDuringPayments: { type: Boolean, default: false },
    txnLinkPayments: { type: Boolean, default: false },
    txnDueDatesPaymentTerms: { type: Boolean, default: false },
    txnShowProfitOnSale: { type: Boolean, default: false },

    // ── Transaction Prefixes ─────────────────────────────────────────
    txnPrefixSale: { type: String, default: 'None' },
    txnPrefixCreditNote: { type: String, default: 'None' },
    txnPrefixSaleOrder: { type: String, default: 'None' },
    txnPrefixPurchaseOrder: { type: String, default: 'None' },
    txnPrefixEstimate: { type: String, default: 'None' },
    txnPrefixProformaInvoice: { type: String, default: 'None' },
    txnPrefixDeliveryChallan: { type: String, default: 'None' },
    txnPrefixPaymentIn: { type: String, default: 'None' },
    txnPrefixSaleFixedAsset: { type: String, default: 'None' },
    txnCustomPrefixes: { type: [String], default: [] },

    // ── Billing Type ─────────────────────────────────────────────────
    txnBillingType: { type: String, default: 'full', enum: ['lite', 'full'] },

    updatedAt: { type: Date, default: Date.now },
});

settingsSchema.index({ companyId: 1 });

module.exports = mongoose.model('Settings', settingsSchema);

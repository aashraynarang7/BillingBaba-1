const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    accountName: { type: String, required: true, trim: true },
    openingBalance: { type: Number, default: 0 },
    asOfDate: { type: Date, default: Date.now },
    accountNumber: { type: String },
    ifscCode: { type: String },
    upiId: { type: String },
    bankName: { type: String },
    accountHolderName: { type: String },
    printUpiQr: { type: Boolean, default: true },
    printBankDetails: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('BankAccount', bankAccountSchema);

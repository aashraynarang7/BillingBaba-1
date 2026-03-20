const mongoose = require('mongoose');

const bankTransferSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    fromAccount: { type: String, required: true },  // accountName
    toAccount: { type: String, required: true },    // accountName
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
    imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('BankTransfer', bankTransferSchema);

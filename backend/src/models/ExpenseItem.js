const mongoose = require('mongoose');

const expenseItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    hsnSac: { type: String, trim: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    taxType: {
        type: String,
        enum: ['Tax Excluded', 'Tax Included'],
        default: 'Tax Excluded'
    },
    taxRate: { type: Number, default: 0 },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

expenseItemSchema.index({ name: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model('ExpenseItem', expenseItemSchema);

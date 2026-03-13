const mongoose = require('mongoose');

const expenseCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    expenseType: {
        type: String,
        enum: ['Direct Expense', 'Indirect Expense'],
        default: 'Indirect Expense'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

expenseCategorySchema.index({ name: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model('ExpenseCategory', expenseCategorySchema);

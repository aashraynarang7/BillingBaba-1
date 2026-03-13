const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure unique category names per company
categorySchema.index({ name: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);

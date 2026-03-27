const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: false
    },
    type: {
        type: String,
        enum: ['product', 'service'],
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    // Online Store — hidden means excluded from online store view; false = visible (default)
    isHiddenFromStore: {
        type: Boolean,
        default: false
    },

    // Online Store — store-specific stock status; false = in stock (default)
    // Independent of isActive (BillingBaba inventory status)
    isOutOfStockOnStore: {
        type: Boolean,
        default: false
    },

    // --- References ---
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

itemSchema.index({ companyId: 1 });
itemSchema.index({ companyId: 1, isActive: 1 });
itemSchema.index({ companyId: 1, type: 1 });

module.exports = mongoose.model('Item', itemSchema);

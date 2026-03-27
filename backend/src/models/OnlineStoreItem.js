const mongoose = require('mongoose');

const onlineStoreItemSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    // Optional link to inventory item — not required (online store can have independent items)
    inventoryItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        default: null,
    },
    name: { type: String, required: true, trim: true },
    itemCode: { type: String, trim: true },
    unit: { type: String, default: 'PCS' },
    category: { type: String, trim: true, default: '' },
    description: { type: String, default: '' },
    images: [{ type: String }],

    // Prices — separate from inventory
    inventoryPrice: { type: Number, default: 0 },  // read-only reference, shown for context
    storePrice: { type: Number, default: 0 },       // actual online selling price

    isVisible: { type: Boolean, default: true },    // show/hide on online store
    isInStock: { type: Boolean, default: true },    // in stock toggle

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

onlineStoreItemSchema.index({ companyId: 1 });
onlineStoreItemSchema.index({ companyId: 1, isVisible: 1 });
onlineStoreItemSchema.index({ companyId: 1, category: 1 });

module.exports = mongoose.model('OnlineStoreItem', onlineStoreItemSchema);

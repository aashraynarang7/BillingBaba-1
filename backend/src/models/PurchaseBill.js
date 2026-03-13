const mongoose = require('mongoose');

const purchaseBillSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    partyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
        required: false
    },
    partyName: { type: String },
    phone: { type: String },

    // Bill Details
    billNumber: { type: String, required: true },
    billDate: { type: Date, default: Date.now },
    dueDate: { type: Date },

    // Reference to Purchase Order
    purchaseOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Purchase', // referencing Purchase model which holds POs
        required: false
    },

    stateOfSupply: { type: String },
    godown: { type: String }, // Warehouse

    items: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        unit: { type: String, default: 'NONE' },
        priceUnit: {
            amount: { type: Number, required: true, default: 0 },
            taxType: { type: String, enum: ['withTax', 'withoutTax'], default: 'withoutTax' }
        },
        discount: {
            percent: { type: Number, default: 0 },
            amount: { type: Number, default: 0 }
        },
        tax: {
            rate: { type: Number, default: 0 },
            amount: { type: Number, default: 0 }
        },
        amount: { type: Number, required: true, default: 0 }
    }],

    // Totals
    subTotal: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    roundOff: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },

    // Payment Info
    paymentType: { type: String, default: 'Cash' },
    paidAmount: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },

    description: { type: String },
    images: [{ type: String }],
    documents: [{ type: String }],

    isReturn: { type: Boolean, default: false },
    originalBillId: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseBill' },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PurchaseBill', purchaseBillSchema);

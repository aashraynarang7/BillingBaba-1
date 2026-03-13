const mongoose = require('mongoose');

const jobWorkOutSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    partyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    partyName: { type: String },
    phone: { type: String },
    billingAddress: { type: String },
    shippingAddress: { type: String },
    jobId: { type: String },
    invoiceDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
    paymentTerms: { type: String, default: 'Due on Receipt' },
    dueDate: { type: Date },
    finishedGood: {
        name: { type: String },
        quantity: { type: Number, default: 1 },
        unit: { type: String, default: 'PCS' }
    },
    items: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        name: { type: String },
        quantity: { type: Number, default: 0 },
        unit: { type: String },
        priceUnit: { amount: { type: Number, default: 0 } },
        amount: { type: Number, default: 0 }
    }],
    additionalCharges: [{
        name: { type: String },
        amount: { type: Number, default: 0 }
    }],
    jobWorkCharges: { type: Number, default: 0 },
    paymentType: { type: String, default: 'Cash' },
    taxRate: { type: Number, default: 0 },
    roundOff: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    description: { type: String },
    status: { type: String, default: 'OPEN' }, // OPEN, CONVERTED
    convertedToInvoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'SaleInvoice' },
    convertedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('JobWorkOut', jobWorkOutSchema);

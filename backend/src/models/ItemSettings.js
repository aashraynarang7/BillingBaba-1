const mongoose = require('mongoose');

const itemSettingsSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, unique: true },

    // Main toggles
    wholesalePrice: { type: Boolean, default: false },
    barcodeScanning: { type: Boolean, default: false },
    itemCategory:    { type: Boolean, default: true },
    description:     { type: Boolean, default: false },

    // Additional fields — each has enabled flag + custom label
    additionalFields: {
        mrp:      { enabled: { type: Boolean, default: false }, label: { type: String, default: 'MRP' } },
        serialNo: { enabled: { type: Boolean, default: false }, label: { type: String, default: 'Serial No.' } },
        batchNo:  { enabled: { type: Boolean, default: false }, label: { type: String, default: 'Batch No.' } },
        expDate:  { enabled: { type: Boolean, default: false }, label: { type: String, default: 'Exp. Date' }, format: { type: String, default: 'mm/yy' } },
        mfgDate:  { enabled: { type: Boolean, default: false }, label: { type: String, default: 'Mfg. Date' }, format: { type: String, default: 'dd/mm/yy' } },
        modelNo:  { enabled: { type: Boolean, default: false }, label: { type: String, default: 'Model No.' } },
        size:     { enabled: { type: Boolean, default: false }, label: { type: String, default: 'Size' } },
    },

    // Custom fields (up to 6)
    customFields: {
        type: [{
            id:          { type: Number, required: true },
            enabled:     { type: Boolean, default: false },
            label:       { type: String, default: '' },
            showInPrint: { type: Boolean, default: false },
        }],
        default: [
            { id: 1, enabled: false, label: '', showInPrint: false },
            { id: 2, enabled: false, label: '', showInPrint: false },
            { id: 3, enabled: false, label: '', showInPrint: false },
            { id: 4, enabled: false, label: '', showInPrint: false },
            { id: 5, enabled: false, label: '', showInPrint: false },
            { id: 6, enabled: false, label: '', showInPrint: false },
        ]
    },

    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ItemSettings', itemSettingsSchema);

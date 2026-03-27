const mongoose = require('mongoose');

const partyGroupSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

partyGroupSchema.index({ companyId: 1 });
partyGroupSchema.index({ companyId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('PartyGroup', partyGroupSchema);

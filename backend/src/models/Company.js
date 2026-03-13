const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: false
  },
  gstin: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  businessType: { type: String },
  businessCategory: { type: String },
  state: { type: String },
  pincode: { type: String },
  signature: { type: String }, // URL or base64
  logo: { type: String },      // URL or base64
  upiId: { type: String },
  bankName: { type: String },
  bankAccountNo: { type: String },
  bankIfsc: { type: String },
  bankAccountHolder: { type: String },
  party: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party'
  }],
  // Owner id if we have auth later
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  teamMembers: [
    {
      name: { type: String, required: true },
      contact: { type: String, required: true },
      role: {
        type: String,
        enum: ['secondary-admin', 'biller', 'biller-salesman', 'ca-accountant', 'salesman', 'stock-keeper'],
        required: true
      },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Company', companySchema);

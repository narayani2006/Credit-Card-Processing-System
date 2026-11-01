const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String, default: '' }
});

const timelineSchema = new mongoose.Schema({
  stage: { type: String, required: true }, // e.g. 'Authorized', 'Captured', 'Settled'
  timestamp: { type: Date, default: Date.now },
  detail: { type: String, default: '' },
  completed: { type: Boolean, default: true }
});

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0.01
    },
    currency: {
      type: String,
      default: 'USD'
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required']
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required']
    },
    cardBrand: {
      type: String,
      default: 'Visa'
    },
    last4: {
      type: String,
      required: true
    },
    expMonth: { type: String, default: '12' },
    expYear: { type: String, default: '28' },
    cardholderName: { type: String, default: '' },
    billingAddress: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zip: { type: String, default: '' }
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Approved', 'Pending', 'Declined', 'Refunded', 'Partially Refunded'],
      default: 'Approved'
    },
    authCode: {
      type: String,
      default: ''
    },
    timeline: [timelineSchema],
    fraudRisk: {
      score: { type: Number, default: 12 },
      level: { type: String, default: 'LOW RISK' },
      signals: [{ type: String }]
    },
    refundInfo: {
      amount: { type: Number, default: 0 },
      reason: { type: String, default: '' },
      refundedAt: { type: Date },
      refundedBy: { type: String, default: '' }
    },
    activityLog: [activitySchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);

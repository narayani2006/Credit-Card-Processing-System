const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    key: {
      type: String,
      required: true,
      unique: true
    },
    maskedKey: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'revoked'],
      default: 'active'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ApiKey', apiKeySchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    phone: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    settings: {
      twoFactorEnabled: { type: Boolean, default: false },
      loginAlerts: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      apiAccess: { type: Boolean, default: true }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);

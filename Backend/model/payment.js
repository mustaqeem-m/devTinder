const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: {
      type: String,
    },
    signature: {
      type: String,
    },
    amount: {
      type: Number, // store amount in smallest unit (e.g., paise)
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      required: true,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
    },

    notes: {
      type: mongoose.Schema.Types.Mixed, // can store any object
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);

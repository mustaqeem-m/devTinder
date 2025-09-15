const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['ignored', 'interested', 'accepted', 'rejected'],
        message: '{Value} is incorrect status typo',
      },
      required: true,
      dafault: 'interested',
    },
  },
  { timestamps: true }
);

// query ll be very fast while finding user with both fromUserId and toUserId
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre('save', function (next) {
  // const connectionRequestSchemaq = this;
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("You can't send request to Yourself !");
  }
  next();
});

module.exports = mongoose.model('connectionRequest', connectionRequestSchema);

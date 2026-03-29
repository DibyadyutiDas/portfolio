const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
    displayName: { type: String, required: true },
    email: { type: String },
    avatar: { type: String },
    profileUrl: { type: String }
  },
  { timestamps: true }
);

userSchema.index({ provider: 1, providerId: 1 }, { unique: true });
userSchema.index({ email: 1 });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String },
    userAgent: { type: String },
    platform: { type: String },
    language: { type: String },
    timezone: { type: String },
    vendor: { type: String },
    memory: { type: Number },
    cores: { type: Number },
    mobile: { type: Boolean },
    touchPoints: { type: Number },
    screen: {
      width: { type: Number },
      height: { type: Number },
      ratio: { type: Number }
    },
    connection: {
      effectiveType: { type: String },
      downlink: { type: Number },
      rtt: { type: Number },
      saveData: { type: Boolean }
    },
    lastSeenAt: { type: Date }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
    displayName: { type: String, required: true },
    email: { type: String },
    avatar: { type: String },
    profileUrl: { type: String },
    lastLoginAt: { type: Date },
    lastLoginIp: { type: String },
    lastDevice: { type: deviceSchema },
    deviceHistory: { type: [deviceSchema], default: [] }
  },
  { timestamps: true }
);

userSchema.index({ provider: 1, providerId: 1 }, { unique: true });
userSchema.index({ email: 1 });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

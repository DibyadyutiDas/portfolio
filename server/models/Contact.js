const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

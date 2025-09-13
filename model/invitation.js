const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  created_at: { type: Date, required: true },
  expires_at: { type: Date, required: true },
  invite_email: { type: String, required: true },
  invite_code: { type: String, required: true },
  creator_id: { type: String, required: true },
  uses: { type: Number, default: 0 },
});

module.exports = mongoose.model('invitation', invitationSchema);

const mongoose = require('mongoose');
const cuid = require('cuid');

const invitationSchema = new mongoose.Schema({
  created_at: { type: String, default: mongoose.now() },
  expires_at: {
    type: String,
    default: mongoose.now() + 7 * 24 * 60 * 60 * 1000,
  }, // 7 days from creation
  invite_email: { type: String, required: true },
  invite_code: { type: String, default: cuid(), required: true },
  creator_id: { type: String, required: true },
  uses: { type: Number, default: 0 },
});

module.exports = mongoose.model('invitation', invitationSchema);

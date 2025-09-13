const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, default: null },
  last_name: { type: String, required: true, default: null },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  invite_code: { type: String },
  // invite code at some point.  then it becomes required.
  token: { type: String },
});

module.exports = mongoose.model('user', userSchema);

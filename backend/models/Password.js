const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  appName: String,
  username: String, // <-- Add this line
  password: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  note: String
});

module.exports = mongoose.model('Password', passwordSchema);

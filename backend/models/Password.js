const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  title: { type: String, required: true },
  username: { type: String },
  password: { type: String, required: true },
  note: { type: String },
});

module.exports = mongoose.model('Password', passwordSchema);

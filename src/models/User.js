const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: String,
  email: String,
  passwordHash: String,
}, {
  timestamps: true,
});

schema.index({ username: 1 }, { unique: true });
schema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', schema);

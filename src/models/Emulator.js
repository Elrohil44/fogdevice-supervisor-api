const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: String,
  emulationType: {
    type: String,
    enum: ['SOFTWARE', 'HARDWARE'],
    required: true,
  },
  pythonCode: String,
}, {
  timestamps: true,
});

schema.index({ user: 1, name: 1 });

module.exports = mongoose.model('Emulator', schema);

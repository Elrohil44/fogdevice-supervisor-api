const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: String,
  emulators: [{
    emulator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Emulator',
    },
    x: Number,
    y: Number,
  }],
  commands: [{
    trigger: {
      type: String,
      enum: ['ONCE', 'ON', 'EVERY', 'AFTER'],
    },
    event: String,
    iteration: Number,
    command: {
      type: String,
      enum: ['PLACE_HEATER', 'REMOVE_HEATER',
        'SET_TEMPERATURE', 'SET_HUMIDITY', 'SET_PRESSURE'],
    },
    params: {
      from: {
        x: Number,
        y: Number,
      },
      to: {
        x: Number,
        y: Number,
      },
      id: String,
      temperature: Number,
      value: Number,
      x: Number,
      y: Number,
    },
  }],
}, {
  timestamps: true,
});

schema.index({ user: 1, name: 1 });

module.exports = mongoose.model('EmulationEnvironment', schema);

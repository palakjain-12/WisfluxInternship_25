const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  mood: { type: String }, // positive / neutral / negative
  keywords: [String],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Entry', EntrySchema);
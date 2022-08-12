const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  songApiId: Number,
  content: String,
  date: Date,
  mood: {
    type: String,
    enum: ['GOOD', 'NEUTRAL', 'BAD'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Page', pageSchema);

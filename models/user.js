const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  passwordHash: String,
  pages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Page',
    },
  ],
});

module.exports = mongoose.model('user', userSchema);

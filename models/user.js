const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  file: {
    filename: String,
    data: Buffer,
    contentType: String,
  },
});
module.exports = mongoose.model('User', userSchema);

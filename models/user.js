const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  file: String,
  // Add other fields as needed
});

module.exports = mongoose.model('User', userSchema);

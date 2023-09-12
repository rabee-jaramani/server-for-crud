const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  checkboxes: JSON,
  dropdown: String,
  radio: String,
  file1: {
    filename: String,
    data: Buffer,
    contentType: String,
  },
  file2: {
    filename: String,
    data: Buffer,
    contentType: String,
  },
});
module.exports = mongoose.model('User', userSchema);

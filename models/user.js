const mongoose = require('mongoose');
const { TRUE } = require('sass');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  file: {
    filename: {
      type: String,
      required: true,
    },
    data: {
      type: Buffer,
      required: false,
    },
    contentType: {
      type: String,
      required: true,
    },
  },
});
module.exports = mongoose.model('User', userSchema);

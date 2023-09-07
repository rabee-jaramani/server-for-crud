const mongoose = require('mongoose');
const { TRUE } = require('sass');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  // file: {
  //   filename: {
  //     type: String,
  //     required: true,
  //   },
  //   data: {
  //     type: Buffer,
  //     required: true,
  //   },
  //   contentType: {
  //     type: String,
  //     required: true,
  //   },
  // },
  file: {
    filename: String,
    data: Buffer,
    contentType: String
  },
});
module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
}, {
  versionKey: false
});

module.exports = mongoose.model('User', schema);
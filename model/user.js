//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-node');
const userSchema = new mongoose.Schema({
  local: {
    username: String,
    email: String,
    password: String,
  },
  // facebook: {
  //   id: String,
  //   token: String,
  //   name: String,
  //   email: String
  // },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  LoginTime: {
    type: Date,
    default: Date.now()
  },
  ContactNumber: Number,
  IsActive: Boolean,
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model("User", userSchema);
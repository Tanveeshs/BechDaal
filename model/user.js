//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-node');
const userSchema = new mongoose.Schema({
  local: {
    username: String,
    email: String,
    password: String,
    isVerified: {
      type: Boolean,
      default: false
    }
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
  name:String,
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

const User = mongoose.model('User', userSchema);

module.exports = {
  User: User,
  user_schema_body: userSchema
}

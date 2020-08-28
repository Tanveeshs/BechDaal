//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-node');
const userSchema = new mongoose.Schema({

  //Contact address could be outside
  local: {
    username: String,
    email: String,
    password: String,
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  noOfFreeAds: {
    type: Number,
    default: 3,
    required:true
  },
  noOfPaidAds:{
    type:Number,
    default:0,
    required:true
  },
  noOfFeaturedAds:{
    type:Number,
    default:0,
    required:true
  },
  facebook: {
    id: String,
    token: String,
    name: String,
    email: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  //true if seller
  isSeller:{type:Boolean},
  LoginTime: {
    type: Date,
    default: Date.now()
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ads'
  }],
  //Extra Field
  Address: {
    line1:String,
    line2:String,
    line3:String,
    line4:String
  },
  ContactNumber: Number,
  Ratings:{type:
        [{
          rating:Number,
          adId:mongoose.Types.ObjectId
        }],
    default:null}
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

function hashing(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}


const User = mongoose.model('User', userSchema);

module.exports = {
  User: User,
  user_schema_body: userSchema,
  genPassword:hashing
};

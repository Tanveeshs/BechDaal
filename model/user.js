//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-node');
const userSchema = new mongoose.Schema({

  //Contact address could be outside
  local: {
    username: String,
    email: String,
    password: String,
    contact : Number,
    address: [String],
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  noOfFreeAds: {
    type: Number,
    default: 3
  },
  noOfPaidAds:{
    type:Number,
    default:0
  },
  noOfFeaturedAds:{
    type:Number,
    default:0
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
  //rejected=true user wont be shown
  rejected:{type:Boolean,default:false},

  LoginTime: {
    type: Date,
    default: Date.now()
  },
  //Only if seller
  rzpId:String,

  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ads'
  }],
  //Extra Field
  Address:String,
  ContactNumber: Number,
  IsActive: Boolean,
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

const User = mongoose.model('User', userSchema);

module.exports = {
  User: User,
  user_schema_body: userSchema
};

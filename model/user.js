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
  //Discuss not required
  offers: [{
    type: mongoose.Types.ObjectId,
    ref: 'Offers'
  }],

  noOfFreeAds: {
    type: Number,
    default: 0
  },

  //Got domain can work on facebook

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

  //if rejected wont be shown
  rejected:{type:Boolean,default:false},

  //why is it there
  LoginTime: {
    type: Date,
    default: Date.now()
  },

  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ads'
  }],
  //Extra Field
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

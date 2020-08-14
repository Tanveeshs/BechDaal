//jshint esversion:6

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  //use adSchema
  ad: {
    type: mongoose.Types.ObjectId,
    ref: 'Ads'
  },
  //use userSchema
  buyer: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  //use userSchema
  seller: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  //created:Offer Given by buyer to seller
  //S_Accepted:Offer Accepted by seller
  //Received->
  status: {
    type: String
  },
  //Add tracking Number
  PickupTimeSeller:Date,
  //Discuss about paytm
  PaymentDetails:{
    rzpId:String
  },
  date_posted: {
    type: Date,
    required: true
  },
  //Reduce Buffer time
  date_expired: {
    type: Date,
    required: true
  },
  //Wont be required
  offer_price : {
    type: Number,
    required: true
  },
  //Ask iska use
  expireAt: {
  type: Date,
  default: Date.now,
  index: { expires: '1d' },
},
});

const Offers = mongoose.model('Offers', offerSchema);
module.exports = Offers;

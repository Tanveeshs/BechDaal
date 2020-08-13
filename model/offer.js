//jshint esversion:6

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  ad: {
    type: mongoose.Types.ObjectId,
    ref: 'Ads'
  },
  buyer: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  seller: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String
  },
  PickupTimeSeller:Date,
  PaymentDetails:{
    rzpId:String
  },
  //created:Offer Given by buyer to seller
  //S_Accepted:Offer Accepted by seller
  //BS_Accepted:Offer Re-Accepted by buyer->becomes a order now
  date_posted: {
    type: Date,
    required: true
  },
  date_expired: {
    type: Date,
    required: true
  },
  offer_price : {
    type: Number,
    required: true
  },
  expireAt: {
  type: Date,
  default: Date.now,
  index: { expires: '1d' },
},
});

const Offers = mongoose.model('Offers', offerSchema);
module.exports = Offers;

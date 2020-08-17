//jshint esversion:6

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {AdSchema} = require('./ad')
const {user_schema_body} = require('./user')

const offerSchema = new Schema({
  ad: AdSchema,
  buyer: user_schema_body,
  seller: user_schema_body,

  //Created:Offer Given by buyer to seller
  //B_Paid:Buyer Paid
  //S_Accepted:Offer Accepted by seller
  //S_Rejected:Offer Rejected by seller
  //Received->
  status: {
    type: String
  },
  date_posted: {
    type: Date,
    required: true
  },
  date_expired: {
    type: Date,
    required: true
  },
  payment:{
    order_id:String,
    payment_id:String,
    refundInitiated:Boolean,
  },
  quantity:Number,
  SpecialMentions:String,
  DeliveryTime:Date,
//   expireAt: {
//   type: Date,
//   default: Date.now,
//   index: { expires: '1d' },
// },
});

const Offers = mongoose.model('Offers', offerSchema);
module.exports = Offers;

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
  }
})

const Offers = mongoose.model('Offers', offerSchema);
module.exports = Offers;

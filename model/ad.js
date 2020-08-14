//jshint esversion:6

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {
  user_schema_body
} = require('./user');



const adSchema = new Schema({
  title: {
    type: String
  },
  category: {
    type: String
  },
  sub_category: {
    type: String
  },
  //Think if is required
  model: {
    type: String
  },
  brand: {
    type: String
  },
  price: {
    type: Number
  },
  user: user_schema_body,
  address: {
    type: String
  },
  //Check if user has contact default value set to that
  contact_number: {
    type: Number
  },
  //change to type string
  cover_photo: {
    type: String
  },
  //change to string
  images: [{
    type: Object
  }],
  description: {
    type: String
  },
  //true if paid extra
  featured: {
    type: Boolean,
    default: false
  },
  date_posted: {
    type: Date
  },
  // Not required

  // date_sold: {
  //   type: Date
  // },
  //
  // offers: [{
  //   type: mongoose.Types.ObjectId,
  //   ref: 'Offers'
  // }],

  approved:{
    type:Boolean,
    default: false
  },
  rejected:{
    val:{
      type:Boolean,
      default:false
    },
    reason:String,
  }
});


const Ads = mongoose.model('Ads', adSchema);
module.exports = Ads;

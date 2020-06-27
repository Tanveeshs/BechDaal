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
  contact_number: {
    type: Number
  },
  cover_photo: {
    type: Object
  },
  images: {
    type: Object
  },
  description: {
    type: String
  },
  date_posted: {
    type: Date
  },
  date_sold: {
    type: Date
  },
});


const Ads = mongoose.model('Ads', adSchema);
module.exports = Ads;

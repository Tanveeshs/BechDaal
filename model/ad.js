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
  //decide for pincode
  serviceable_area:[String],
  date_posted: {
    type: Date
  },
  deliverableAreas: [{
    type: String
  }],
  deliveryTimes:[{
    From:String,
    To:String
  }],
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
  },
  payment:{
    order_id:String,
    payment_id:String,
  },
  //Would be set to true if Paid or free ad
  //Would be set to false if Unpaid
  isPaid:Boolean,
  reviews:[{
    Comment:String,
    by:String,
    time:{type:Date,default:Date.now()}
  }],
  //Average Rating
  AvgRating:{type:Number,default:0},
  //Number of Users That rated
  NumRated:{type:Number,default:0}
});


const Ads = mongoose.model('Ads', adSchema);
module.exports = Ads;

//jshint esversion:6

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {
  user_schema_body
} = require('./user');



const adSchema = new Schema({
  title: {
    type: String,
    required:true
  },
  category: {
    type: String,
    required:true
  },
  sub_category: {
    type: String,
    required:true
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
  cover_photo: {
    type: String
  },
  images: [String],
  description: {
    type: String
  },
  //decide for pincode
  date_posted: {
    type: Date
  },
  deliverableAreas: [{
    type: String
  }],
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
  //0 if free
  //1 if Paid
  //2 if featured
  isPaid:Number,
  //To determine whether ad is active
  //If true only then show
  isActive:{
    type:Boolean,
    default:true
  },
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
module.exports.AdSchema = adSchema
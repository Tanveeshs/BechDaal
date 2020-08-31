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
  },
  //Changed to Quantity par renamed as model only
  model: {
    type: String,
    required:true
  },
  price: {
    type: Number,
    required:true
  },
  user: {
    type:user_schema_body,
    required:true
  },
  cover_photo: {
    type: String,
    required:true
  },
  images: [String],
  description: {
    type: String,
    required:true
  },
  //decide for pincode
  date_posted: {
    type: Date,
    required:true,
    default:Date.now()
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
  isPaid:{
    type:Number,
    required:true
  },
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

adSchema.index({date_posted:1})
adSchema.index({approved:1,isActive:1,'rejected.val':1})

const Ads = mongoose.model('Ads', adSchema);
module.exports = Ads;
module.exports.AdSchema = adSchema

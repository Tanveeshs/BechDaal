//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-node');

const categorySchema = new mongoose.Schema({
  name: {
    type:String,
    required:true
  },
  subcategory:{
    type:[String],
    required:true
  } ,
  image:{
    type:String,
    required:true
  }
});

module.exports.CategoryModel = mongoose.model("Category", categorySchema);
module.exports.categorySchema = categorySchema;

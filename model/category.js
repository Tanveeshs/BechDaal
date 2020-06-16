//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-node');

const categorySchema = new mongoose.Schema({
  name: String,
  subcategory: [String],
});

module.exports.CategoryModel = mongoose.model("Category", categorySchema);
module.exports.categorySchema = categorySchema;

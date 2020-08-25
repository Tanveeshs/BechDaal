//jshint esversion:6

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {AdSchema} = require('./ad')
const {user_schema_body} = require('./user')

const helpSchema = new Schema({

  category: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date_posted :{
    type: Date,
    default:Date.now()
  },
  status:{type:String},
  reg_user:{type:user_schema_body},
  non_reg_user:{
    name:{type:String},
    email:{type:String}
  }
});

const Help = mongoose.model('Help', helpSchema);
module.exports = Help;

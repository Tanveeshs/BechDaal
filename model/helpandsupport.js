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
  status:{type:String,required:true},
  user:{
    name:{type:String},
    email:{type:String}
  },
  resolution:{type:String,default:undefined}
});

const Help = mongoose.model('Help', helpSchema);
module.exports = Help;

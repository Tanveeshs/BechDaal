//jshint esversion:6

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {AdSchema} = require('./ad')
const {user_schema_body} = require('./user')

const helpSchema = new Schema({

  category: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
},
date_posted :{
  type: Date,
  required:true
},
user: user_schema_body,
});

const Help = mongoose.model('Help', helpSchema);
module.exports = Help;

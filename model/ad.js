const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String },
  age: { type: Number },
})

const adSchema = new Schema({
  title: { type: String },
  category: { type: String },
  sub_category: { type: String },
  model: { type: String },
  brand: { type: String },
  price: { type: Number },
  user: userSchema,
  address: { type: String },
  contact_number: { type: Number },
  images: [{ type: String }],
  description: { type: String },
  date_posted: { type: Date },
  date_sold: { type: Date },
})


const Ads = mongoose.model('Ads', adSchema);
module.exports = Ads;
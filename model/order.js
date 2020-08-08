const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('./user').user_schema_body

const orderSchema  = Schema({
    ad:mongoose.Types.ObjectId,
    buyer:user,
    seller:user,
    paymentMethod:{
        method:String,
        orderId:String,
        paymentId:String,
    },
    PickUpTimeSeller:Date,
    price:Number,
    DeliveryAssigned:String,
    Status:String,
    TrackingDetails:{
        DeliveryProvider:String,
        ReferenceNumber:String
    }
})

module.exports = mongoose.model('order',orderSchema,'orders')
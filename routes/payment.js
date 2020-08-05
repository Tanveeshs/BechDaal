const express = require('express')
const Router = express.Router()
const Razorpay = require('razorpay')
const instance = new Razorpay({
    key_id:process.env.razorpay_key,
    key_secret:process.env.razorpay_secret
})
const crypto = require('crypto')


Router.post('/success',function (req,res){
    console.log(req.body)
    var hash = crypto.createHmac('SHA256',process.env.razorpay_secret).update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id)
        .digest('hex')
    console.log(hash)
    if(hash == req.body.razorpay_signature){
        res.render('success.ejs')
    }

    else {
        res.send('Error')
    }
})
Router.get('/',function (req,res){
    var options = {
        amount: 2000,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11",
        payment_capture: '0'
    };
    instance.orders.create(options, function(err, order) {
        console.log(order)
        res.render('payment.ejs',{
            order_id:order.id,
            amount:2000,
            name:req.user.local.username,
            email:req.user.local.email,
            contact:req.user.local.contact,
            key_id:process.env.razorpay_key
        })

    });
})

module.exports = Router;
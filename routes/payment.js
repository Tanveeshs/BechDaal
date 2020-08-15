const express = require('express')
const Router = express.Router()
const Razorpay = require('razorpay')
const instance = new Razorpay({
    key_id:process.env.razorpay_key,
    key_secret:process.env.razorpay_secret
})
const ad = require('../model/ad')
const uuid = require('uuid')
const crypto = require('crypto')
const sanitize = require("mongo-sanitize");


//Payment Route for Featured Ad and Normal Ad
Router.post('/ad',function (req,res){
    const adId = req.body.adId;
    const amount = req.body.amount;
    var options = {
        amount: amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: uuid.v4(),
        payment_capture: '1',
        notes:{
            adId:adId
        }
    };
    instance.orders.create(options, function(err, order) {
        console.log(order)
        if(err){
            return res.json({"Error":err})
        }
        ad.findOneAndUpdate({_id:sanitize(req.body.adId)},{$set:{'payment.order_id':order.id}},function (err){
            if(err){
                return res.json({"Error":err})
            }
        })
        res.render('payment.ejs',{
            order_id:order.id,
            amount:2000,
            name:req.user.local.username,
            email:req.user.local.email,
            contact:req.user.local.contact,
            key_id:process.env.razorpay_key,
        })
    });
})


//Callback for the Featured ad and Normal ad

//If payment successful we are setting isPaid to true
//Add Error Page
Router.post('/callback',function (req,res){
    console.log(req.body)
    var hash = crypto.createHmac('SHA256',process.env.razorpay_secret).update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id)
        .digest('hex')
    console.log(hash)
    if(hash === req.body.razorpay_signature) {
        instance.orders.fetch(req.body.razorpay_order_id)
            .then(r=>{
                if(r.amount===2000){
                    ad.findOneAndUpdate({'payment.order_id':req.body.razorpay_order_id},{$set:{
                            'payment.payment_id':req.body.razorpay_payment_id,featured:true,isPaid: true}
                            },function (err,doc){
                        if(err){
                            console.log(err)
                        }
                        res.render('success.ejs')
                    })
                }
                else {
                    ad.findOneAndUpdate({'payment.order_id':req.body.razorpay_order_id},{$set:{
                            'payment.payment_id':req.body.razorpay_payment_id,isPaid:true}
                            },function (err,doc){
                        if(err){

                        }
                        res.render('success.ejs')
                    })
                }
                console.log(r.amount)
                res.send('Done')
            })
            .catch((err)=>{
                res.send("Error Wrong Order ID")
            })
    } else {
        res.send('Error')
    }
})



module.exports = Router;
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
const offer = require('../model/offer')

//Payment Route for Featured Ad and Normal Ad
//Params: amount and adId
Router.post('/ad',function (req,res){
    const adId = req.body.adId;
    const amount = Number(req.body.amount)*100;
    let options = {
        amount: amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: uuid.v4(),
        payment_capture: '1',
        notes: {
            adId: adId,
        }
    };
    instance.orders.create(options, function(err, order) {
        console.log(err)
        if(err){
            return res.json({"Error":err})
        }
        ad.findOneAndUpdate({_id:sanitize(req.body.adId)},{$set:{'payment.order_id':order.id}},function (err){
            if(err){
                console.log(err)
                return res.json({"Error":err})
            }
        })
        if(amount===2000){
            res.render('payment.ejs',{
                order_id:order.id,
                amount:amount,
                name:req.user.local.username,
                email:req.user.local.email,
                contact:req.user.local.contact,
                description:'Featured Ad',
                key_id:process.env.razorpay_key,
            })
        }
        else if(amount===1000){
            res.render('payment.ejs',{
                order_id:order.id,
                amount:amount,
                name:req.user.local.username,
                email:req.user.local.email,
                contact:req.user.local.contact,
                description:'Normal Ad',
                key_id:process.env.razorpay_key,
            })
        }
        else {
            console.log('Error Page')
        }
    });
})

//Callback for the Featured ad and Normal ad
//If payment successful we are setting isPaid to true
//Add Error Page
Router.post('/callback',function (req,res){
    var hash = crypto.createHmac('SHA256',process.env.razorpay_secret).update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id)
        .digest('hex')
    console.log(hash)
    if(hash === req.body.razorpay_signature) {
        instance.orders.fetch(req.body.razorpay_order_id)
            .then(r=>{
                if(r.amount===2000){
                    ad.findOneAndUpdate({'payment.order_id':req.body.razorpay_order_id},{$set:{
                            'payment.payment_id':req.body.razorpay_payment_id,featured:true,isPaid: true}
                            },function (err){
                        if(err){
                            console.log(err)
                        }
                        console.log(r.notes)
                        res.render('success.ejs')
                    })
                }
                else {
                    ad.findOneAndUpdate({'payment.order_id':req.body.razorpay_order_id},{$set:{
                            'payment.payment_id':req.body.razorpay_payment_id,isPaid:true}
                            },function (err){
                        if(err){

                        }
                        res.render('success.ejs')
                    })
                }
                console.log(r.amount)

                res.send('Done')
            })
            .catch((err)=>{
                res.send("Error Wrong Order ID",err)
            })
    } else {
        res.send('Error')
    }
})


//payment for offer
//Params adId,quantity,specialMentions,DeliveryTime
Router.get('/offer',(req,res)=>{
    const adId = sanitize(req.body.adId)
    const quantity = req.body.quantity;
    const specialMentions = req.body.specialMentions;
    const DeliveryTime = req.body.DeliveryTime
    ad.findOne({_id:adId},function (err,adforoffer){
        const obj = new offer()
        obj.ad = adforoffer;
        obj.buyer = req.user;
        obj.seller = adforoffer.user;
        obj.date_posted = Date.now()
        //4 hours expiry
        obj.date_expired = Date.now()+(1000*60*60*4)
        obj.status = 'Created'
        obj.quantity =quantity
        obj.SpecialMentions = specialMentions
        obj.DeliveryTime = DeliveryTime
        let amount =Number(adforoffer.price)*100*Number(quantity);
        var options = {
            amount:amount ,  // amount in the smallest currency unit
            currency: "INR",
            receipt: uuid.v4(),
            payment_capture: '1',
            notes:{
                offerId:obj._id
            },
            transfers:[{
                account:adforoffer.user.rzpId,
                amount:0.95*amount,
                currency:"INR",
                on_hold:1,
                on_hold_until:Date.now()+(1000*60*60*24*2)
            }]
        };
        instance.orders.create(options,function (err,order){
            if(err)
                console.log(err)
            obj.payment.order_id = order.id
            obj.save()
            res.render('payment.ejs',{
                order_id:order.id,
                amount:amount,
                name:req.user.local.username,
                email:req.user.local.email,
                contact:req.user.local.contact,
                description:'Payment for order',
                key_id:process.env.razorpay_key,
            })
        })
    })
})

//Callback for offer route
Router.get("/offer/callback",(req,res)=> {
    var hash = crypto.createHmac('SHA256', process.env.razorpay_secret).update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id)
        .digest('hex')
    console.log(hash)
    if (hash === req.body.razorpay_signature) {
        instance.orders.fetch(req.body.razorpay_order_id)
            .then(r => {
                    offer.findOneAndUpdate({'payment.order_id':req.body.razorpay_order_id},
                        {$set:{status:'B_Paid','payment.payment_id':req.body.razorpay_payment_id}},
                        function (err){
                                if(err){
                                    console.log(err)
                                }
                        })
                })
            .catch(err=>{console.log(err)})
    }
})


module.exports = Router;
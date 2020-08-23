const express = require('express')
const Router = express.Router()
const Razorpay = require('razorpay')
const instance = new Razorpay({
    key_id:process.env.razorpay_key,
    key_secret:process.env.razorpay_secret
})
const uuid = require('uuid')
const crypto = require('crypto')
const User = require('../model/user').User
const sanitize = require("mongo-sanitize");

//Payment Route for Featured Ad and Normal Ad
//Params: quantity & type
Router.post('/ad',function (req,res){
    const type = req.body.type;
    const quantity = req.body.quantity;
    let amount;
    if(type==='Featured'){
        amount = 20*Number(quantity)*100
    }
    else {
        amount = 10*Number(quantity)*100
    }
    let options = {
        amount: amount,
        currency: "INR",
        receipt: uuid.v4(),
        payment_capture: '1',
        notes: {
            user:String(req.user._id),
            type:type,
            quantity:quantity
        }
    };
    instance.orders.create(options, function(err, order) {
        console.log(err)
        if (err) {
            return res.json({"Error": err})
        }
        if (type === 'Featured') {
            res.render('payment.ejs', {
                order_id: order.id,
                amount: amount,
                name: req.user.local.username,
                email: req.user.local.email,
                contact: req.user.local.contact,
                description: 'Featured Ad',
                key_id: process.env.razorpay_key,
            })
        } else {
            res.render('payment.ejs', {
                order_id: order.id,
                amount: amount,
                name: req.user.local.username,
                email: req.user.local.email,
                contact: req.user.local.contact,
                description: 'Normal Ad',
                key_id: process.env.razorpay_key,
            })
        }
    })
})

//If payment successful we are setting incrementing noOfFeaturedAds and noOfNormalAds
//Add Success Page
//At success page show order_id in case of any issues
Router.post('/callback',function (req,res){
    var hash = crypto.createHmac('SHA256',process.env.razorpay_secret)
        .update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id)
        .digest('hex')
    if(hash === req.body.razorpay_signature) {
        instance.orders.fetch(req.body.razorpay_order_id)
            .then(r=>{
                if(r.notes.type==='Featured'){
                    User.findOneAndUpdate({_id:String(req.user._id)},
                        {$inc:{noOfFeaturedAds:Number(r.notes.quantity)}},
                        {new:true},
                        function (err,user){
                            if(err){
                                console.log(err);
                                return returnErr(res, "Error", "Our server ran into an error please try again")
                            }
                            req.user = user;
                            res.send('Your Payment Has Been accepted The Ads have Been added to your account' +
                                'If you still face any troubles please contact support');
                        })
                }
                else {
                    User.findOneAndUpdate({_id:String(req.user._id)},
                        {$inc:{noOfPaidAds:Number(r.notes.quantity)}},
                        {new:true},
                        function (err,user){
                            if(err){
                                console.log(err);
                                return returnErr(res, "Error", "Our server ran into an error please try again")
                            }
                            req.user = user;
                            res.send('Your Payment Has Been accepted The Ads have Been added to your account' +
                                'If you still face any troubles please contact support');
                        })

                }
            })
    }
    else {
        return returnErr(res, "Invalid Payment",
            "Your payment hasnt been confirmed by the payment provider,Please contact support")
    }
})

function returnErr(res,message,err){
    res.render('error.ejs',{
        message:message,
        error:err
    })
}

//payment for offer
//Params adId,quantity,specialMentions,DeliveryTime
// Router.get('/offer',(req,res)=>{
//     const adId = sanitize(req.body.adId)
//     const quantity = req.body.quantity;
//     const specialMentions = req.body.specialMentions;
//     const DeliveryTime = req.body.DeliveryTime
//     ad.findOne({_id:adId},function (err,adforoffer){
//         const obj = new offer()
//         obj.ad = adforoffer;
//         obj.buyer = req.user;
//         obj.seller = adforoffer.user;
//         obj.date_posted = Date.now()
//         //4 hours expiry
//         obj.date_expired = Date.now()+(1000*60*60*4)
//         obj.status = 'Created'
//         obj.quantity =quantity
//         obj.SpecialMentions = specialMentions
//         obj.DeliveryTime = DeliveryTime
//         let amount =Number(adforoffer.price)*100*Number(quantity);
//         var options = {
//             amount:amount ,  // amount in the smallest currency unit
//             currency: "INR",
//             receipt: uuid.v4(),
//             payment_capture: '1',
//             notes:{
//                 offerId:obj._id
//             },
//             transfers:[{
//                 account:adforoffer.user.rzpId,
//                 amount:0.95*amount,
//                 currency:"INR",
//                 on_hold:1,
//                 on_hold_until:Date.now()+(1000*60*60*24*2)
//             }]
//         };
//         instance.orders.create(options,function (err,order){
//             if(err)
//                 console.log(err)
//             obj.payment.order_id = order.id
//             obj.save()
//             res.render('payment.ejs',{
//                 order_id:order.id,
//                 amount:amount,
//                 name:req.user.local.username,
//                 email:req.user.local.email,
//                 contact:req.user.local.contact,
//                 description:'Payment for order',
//                 key_id:process.env.razorpay_key,
//             })
//         })
//     })
// })
//Callback for offer route
// Router.get("/offer/callback",(req,res)=> {
//     var hash = crypto.createHmac('SHA256', process.env.razorpay_secret).update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id)
//         .digest('hex')
//     console.log(hash)
//     if (hash === req.body.razorpay_signature) {
//         instance.orders.fetch(req.body.razorpay_order_id)
//             .then(r => {
//                 offer.findOneAndUpdate({'payment.order_id':req.body.razorpay_order_id},
//                     {$set:{status:'B_Paid','payment.payment_id':req.body.razorpay_payment_id}},
//                     function (err){
//                         if(err){
//                             console.log(err)
//                         }
//                     })
//             })
//             .catch(err=>{console.log(err)})
//     }
// })


module.exports = Router;
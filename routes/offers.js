//jshint esversion:6

const axios = require('axios');
const express = require('express');
const router = express.Router();

let offers = require('../model/offer');


//Work on something where what happens if offer expired then how to initiate refund

//To Get Offers of User And Seller

router.get('/', isLoggedIn, (req, res) => {
  offers.find({'buyer._id':req.user._id},{_id:1,ad:1,buyer:1,status:1,date_expired:1,quantity:1,SpecialMentions:1,DeliveryTime:1},function (err,Offers){
    let paid_orders = []
    let seller_accepted_orders = []
    let received_orders = []
    Offers.forEach(offer=>{
      if(offer.status==='B_Paid'){
        paid_orders.push(offer)
      }
      else if(offer.status==='S_Accepted'){
        seller_accepted_orders.push(offer)
      }
      else if(offer.status==='Received'){
        received_orders.push(offer)
      }
    })
    res.render('myoffers.ejs',{
      seller:(req.user.isSeller===true),
      paid_orders:paid_orders,
      seller_accepted_orders:seller_accepted_orders,
      received_orders:received_orders
    })
  })
});

//Accept an offer Initiate a refund
//params OfferId
router.post('/accept',(req,res)=>{
  const offerId = req.body.offerId;
  offers.findOneAndUpdate({_id:offerId},{$set:{status:'S_Accepted'}},function (err){
    if(err){
      res.send("Error Accepting the Order")
    }
    else {
      res.redirect('/offers')
    }
  })
})
//Reject An Offer Initiate a refund
//params OfferId
router.post('/rejected',(req,res)=>{
  const offerId = req.body.offerId;
  offers.findOneAndUpdate({_id:offerId},{$set:{status:'S_Rejected'}},{new:true},function (err,offer){
    if(err){
      res.send("Error Rejecting the Order")
    }
    else {
      const url = `https://${process.env.razorpay_key}:${process.env.razorpay_secret}@api.razorpay.com/v1/payments/`+offer.payment.payment_id+'/refund';
      axios.post(url).then(r => {
        offer.payment.refundInitiated = true;
        offer.save()
      }).catch(err=>{
        console.log("Error ")
        res.send("There is an error processing your refund Please contact support section")
      })
      res.redirect('/offers')
    }
  })
})




// Wouldnt be required now
// router.post('/:adId', function(req, res) {
//   var newOffer = new Offer();
//
//   newOffer.ad = req.params.adId;
//   newOffer.buyer = req.user._id;
//   newOffer.seller = req.body.sellerId;
//   newOffer.status = 'Sent';
//   newOffer.date_posted = new Date();
//   newOffer.date_expired = Date.now() + (24 * 60 * 60 * 1000);
//   newOffer.offer_price = req.body.offer_price;
//
//   newOffer.save(function(err) {
//     if (err)
//       throw err;
//   });
//
//   //update buyer offers
//   User.findOne({
//     _id: newOffer.buyer
//   }, (err, buyer) => {
//     if (typeof(buyer.offers) == 'undefined') {
//       offersArray = [];
//       offersArray.push(newOffer._id);
//       buyer.offers = offersArray;
//       buyer.save();
//     } else {
//       buyer.offers.push(newOffer._id);
//       buyer.save();
//     }
//   })
//
//   //update seller offers
//   User.findOne({
//
//     _id: newOffer.seller
//   }, (err, seller) => {
//     if (typeof(seller.offers) == 'undefined') {
//       offersArray = [];
//       offersArray.push(newOffer._id);
//       seller.offers = offersArray;
//       seller.save();
//     } else {
//       seller.offers.push(newOffer._id);
//       seller.save();
//     }
//   })
//
//   //update Ads offers
//   Ads.findOne({
//     _id: newOffer.ad
//   }, (err, ad) => {
//     if (typeof(ad.offers) == 'undefined') {
//       offersArray = [];
//       offersArray.push(newOffer._id);
//       ad.offers = offersArray;
//       ad.save();
//     } else {
//       ad.offers.push(newOffer._id);
//       ad.save();
//     }
//   })
//
//   res.redirect('/');
// });

function isLoggedIn(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      req.isLogged = true;
      return next();
    }
    res.redirect('/login');
  } catch (e) {
    console.log(e);
  }
}


module.exports = router;

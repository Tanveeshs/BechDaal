//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Ads = require('../model/ad');
var {
  User
} = require('../model/user');
var Offer = require('../model/offer');

router.get('/', isLoggedIn, (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      res.render('myoffers', {
        user: req.user,
        offers: user.offers
      });
    });
});

router.post('/:adId', function(req, res) {
  var newOffer = new Offer();

  newOffer.ad = req.params.adId;
  newOffer.buyer = req.user._id;
  newOffer.seller = req.body.sellerId;
  newOffer.status = 'Sent';
  newOffer.date_posted = new Date();
  newOffer.date_expired = new Date(),
    newOffer.offer_price = req.body.offer_price;

  newOffer.save(function(err) {
    if (err)
      throw err;
  });

//update buyer offers
  User.findOne({
    _id: newOffer.buyer
  }, (err, buyer) => {
    if (typeof(buyer.offers) == 'undefined'){
      offersArray=[];
      offersArray.push(newOffer._id);
      buyer.offers = offersArray;
      buyer.save();
    }
    else{
      buyer.offers.push(newOffer._id);
      buyer.save();
    }
  })

//update seller offers
User.findOne({
  _id: newOffer.seller
}, (err, seller) => {
  if (typeof(seller.offers) == 'undefined'){
    offersArray=[];
    offersArray.push(newOffer._id);
    seller.offers = offersArray;
    seller.save();
  }
  else{
    seller.offers.push(newOffer._id);
    seller.save();
  }
})

//update Ads offers
Ads.findOne({
  _id: newOffer.ad
}, (err, ad) => {
  if (typeof(ad.offers) == 'undefined'){
    offersArray=[];
    offersArray.push(newOffer._id);
    ad.offers = offersArray;
    ad.save();
  }
  else{
    ad.offers.push(newOffer._id);
    ad.save();
  }
})

  res.redirect('/');
});

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

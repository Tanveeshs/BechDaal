//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const async = require('async')
const Ads = require('../model/ad');
var {
  User
} = require('../model/user');
var Offer = require('../model/offer');
var offers = require('../model/offer');
const ad = require('../model/ad');

router.get('/', isLoggedIn, (req, res) => {
  offers.find({
    date_expired: {
      $gte: Date.now()
    },
    $or: [{
        buyer: req.user._id
      },
      {
        seller: req.user._id
      }
    ]
  }, function(err, results) {
    let userIds = [];
    let adIds = [];
    let userDict = {};
    let adDict = {};
    results.forEach(offer => {
      userIds.push(offer.buyer);
      userIds.push(offer.seller);
      adIds.push(offer.ad);
    });
    async.parallel([
      function(callback) {
        User.find({
          _id: {
            $in: userIds
          }
        }, function(err, users) {
          users.forEach(user => {
            userDict[user._id] = user;
          });
          callback(null, 'Done');
        });
      },
      function(callback) {
        ad.find({
          _id: {
            $in: adIds
          }
        }, function(err, users) {
          users.forEach(user => {
            adDict[user._id] = user;
          });
          callback(null, 'Done');
        });
      }
    ], function(err, results1) {
      let currentOffers = [];
      results.forEach(offer => {
        let off = {
          ad: adDict[offer.ad].title,
          buyer: userDict[offer.buyer].local.username,
          seller: userDict[offer.seller].local.username,
          status: offer.status,
          date_expired: offer.date_expired,
          offer_price: offer.offer_price
        };
        currentOffers.push(off);
      });
      console.log(currentOffers);
      res.render('myoffers', {
        user: req.user,
        offers: currentOffers
      });
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
  newOffer.date_expired = Date.now() + (24 * 60 * 60 * 1000);
  newOffer.offer_price = req.body.offer_price;

  newOffer.save(function(err) {
    if (err)
      throw err;
  });

  //update buyer offers
  User.findOne({
    _id: newOffer.buyer
  }, (err, buyer) => {
    if (typeof(buyer.offers) == 'undefined') {
      offersArray = [];
      offersArray.push(newOffer._id);
      buyer.offers = offersArray;
      buyer.save();
    } else {
      buyer.offers.push(newOffer._id);
      buyer.save();
    }
  })

  //update seller offers
  User.findOne({

    _id: newOffer.seller
  }, (err, seller) => {
    if (typeof(seller.offers) == 'undefined') {
      offersArray = [];
      offersArray.push(newOffer._id);
      seller.offers = offersArray;
      seller.save();
    } else {
      seller.offers.push(newOffer._id);
      seller.save();
    }
  })

  //update Ads offers
  Ads.findOne({
    _id: newOffer.ad
  }, (err, ad) => {
    if (typeof(ad.offers) == 'undefined') {
      offersArray = [];
      offersArray.push(newOffer._id);
      ad.offers = offersArray;
      ad.save();
    } else {
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

//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Ads = require('../model/ad');
var {
  User
} = require('../model/user');
var Offer = require('../model/offer');

router.post('/:adId',function(req,res){
  var newOffer = new Offer();

  newOffer.ad = req.params.adId;
  newOffer.buyer = req.user._id;
  newOffer.seller = req.body.sellerId;
  newOffer.status = 'Sent';
  newOffer.date_posted=new Date();
  newOffer.date_expired=new Date(),
  newOffer.offer_price = req.body.offer_price;

  newOffer.save(function(err) {
    if (err)
      throw err;
  });
  res.redirect('/')
});

router.get('/',function(req, res){
    User.findById(req.user._id)
        .then((user) => {
            if (user != null) {
                res.send(user.offers);
        }
    });
});



module.exports = router;

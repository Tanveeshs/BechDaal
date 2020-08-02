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

router.get('/:userId',function(req, res){
    const _id = req.params.userId;
    User.findById(_id)
        .then((user) => {
            if (user != null) {
                res.send(user.offers);
        //       User.findById(req.user._id)
        //         .then((user) => {
        //           if (user.wishlist.includes(_id)) {
        //             user.wishlist.splice(user.wishlist.indexOf(_id), 1);
        //           } else {
        //             user.wishlist.push(_id);
        //           }
        //           user.save()
        //             .then((user) => {
        //               res.statusCode = 200;
        //               res.setHeader('Content-Type', 'application/json');
        //               res.render('mywishlist', {
        //                 user: req.user,
        //                 array: ad
        //               });
        //               // res.redirect('/wish')
        //             });
        //         });
        //     } else {
        //       console.log('the ad id is wrong!');
        //       res.statusCode = 404;
        //       res.setHeader('Content-Type', 'application/json');
        //       res.json({
        //         msg: 'wrong ad id'
        //       });
        //     }
        //   })
        //   .catch((err) => console.log(err));
        }
    });
});



module.exports = router;

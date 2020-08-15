//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const Ads = require('../model/ad');
const sanitize = require('mongo-sanitize');
const {
  User
} = require('../model/user');

const wishlistRouter = express.Router();

wishlistRouter.use(bodyParser.json());

wishlistRouter.get('/', isLoggedIn, (req, res, next) => {
  User.findById(sanitize(req.user._id))
    .populate('wishlist')
    .then((user) => {
      res.render('mywishlist', {
        user: req.user,
        array: user.wishlist
      });
    })
    .catch((err) => console.log(err));
});

wishlistRouter.get('/:adId', isLoggedIn, (req, res, next) => {
  const _id = sanitize(sanitize(req.params.adId));
  Ads.findById(_id)
    .then((ad) => {
      if (ad != null) {
        User.findById(sanitize(req.user._id))
          .then((user) => {
            if (user.wishlist.includes(_id)) {
              user.wishlist.splice(user.wishlist.indexOf(_id), 1);
            } else {
              user.wishlist.push(_id);
            }
            user.save()
              .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.render('mywishlist', {
                  user: req.user,
                  array: ad
                });
                // res.redirect('/wish')
              });
          });
      } else {
        console.log('the ad id is wrong!');
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          msg: 'wrong ad id'
        });
      }
    })
    .catch((err) => console.log(err));
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
function isSellerAndAuthenticated(req, res, next) {
    try {
        if (req.isAuthenticated()) {
            if(req.user.isSeller){
                return next();
            }
        }
        res.redirect('/login');
    } catch (e) {
        console.log(e);
    }
}


module.exports = wishlistRouter;

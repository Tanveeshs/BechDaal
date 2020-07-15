//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Ads = require('../model/ad');
const {
  User
} = require('../model/user');

const wishlistRouter = express.Router();

wishlistRouter.use(bodyParser.json());

wishlistRouter.route('/')
  .get((req, res, next) => {
    console.log(req.user);
    User.findById(req.user._id)
      .populate('wishlist')
      .then((user) => {
        res.render('mywishlist', {
          user: req.user,
          array: user.wishlist
        });
      })
      .catch((err) => console.log(err));
  });

wishlistRouter.route('/:adId')
  .get((req, res, next) => {
    const _id = req.params.adId;
    Ads.findById(_id)
      .then((ad) => {
        if (ad != null) {
          User.findById(req.user._id)
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
                  res.json({
                    msg: 'ok',
                    user: req.user,
                    ad
                  });
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

module.exports = wishlistRouter;

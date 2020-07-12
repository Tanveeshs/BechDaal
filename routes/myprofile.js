//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Ads = require('../model/ad');
const {
  user
} = require('../model/user');
var {
  User
} = require('../model/user');


router.get('/', function(req, res) {
  res.render('myprofile.ejs', {
    user: req.user
  });

});

router.get('/edit', function(req, res) {
  res.render('editprofile.ejs', {
    user: req.user
  });

});

router.post('/editprofile', function(req, res) {
  console.log(req.body.username1);
  User.update({
    _id: req.user._id
  }, {
    $set: {
      username: req.body.username1
    }
  });
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

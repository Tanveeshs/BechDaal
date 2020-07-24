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


router.get('/', isLoggedIn, function(req, res) {
  res.render('myprofile.ejs', {
    user: req.user
  });

});

router.get('/edit', isLoggedIn, function(req, res) {
  res.render('editprofile.ejs', {
    user: req.user
  });

});

router.post('/editprofile', function(req, res) {

  a = req.body.ivalue;
  a = a.split(',');
  User.findOneAndUpdate({
    _id: req.user._id
  }, {
    "$set": {
      'local.username': req.body.username1,
      'local.contact': req.body.contact1,
      'local.address': a
    }
  }, function(err, res) {
    // Updated at most one doc, `res.modifiedCount` contains the number
    // of docs that MongoDB updated
    if (err) {
      console.log(err);
    }

  });
  res.redirect('/myprofile');
});
//
// router.post('/addAddress', function(req, res){
//   console.log(Object.values(req.body)[0]);
//   User.findOneAndUpdate({
//     _id: req.user._id
//   }, {
//     "$set": {
//       'local.address': Object.values(req.body)[0]
//     }
//   }, function(err, res) {
//     // Updated at most one doc, `res.modifiedCount` contains the number
//     // of docs that MongoDB updated
//     if (err) {
//       console.log(err);
//     }
//   });
//   res.redirect('/myprofile');
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

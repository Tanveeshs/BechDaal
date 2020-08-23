//jshint esversion:6
//ISLOGGEDIN KA VERIFY WAALA PART


const express = require('express');
const sanitize = require("mongo-sanitize");
const router = express.Router();
let {
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
//DONT USE GLOBAL VARIABLES


router.post('/editprofile', function(req, res) {
  User.findOneAndUpdate({
    _id: req.user._id
  }, {
    "$set": {
      'local.username': req.body.username1,
      'ContactNumber': req.body.contact1,
       'Address.line1' : req.body.line1,
       'Address.line2' : req.body.line2,
       'Address.line3' : req.body.line3,
       'Address.line4' : req.body.line4,
    }
  },{new:true},function(err,doc) {
    if (err) {
      console.log(err);
      return returnErr(res, "Error", "Our server ran into an error please try again")
    }
    req.user = doc;
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

function returnErr(res,message,err){
  res.render('error.ejs',{
    message:message,
    error:err
  })
}
module.exports = router;

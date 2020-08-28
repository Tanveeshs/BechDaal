//jshint esversion:6



const express = require('express');
const sanitize = require("mongo-sanitize");
const router = express.Router();
let {
  User
} = require('../model/user');

router.get('/', isLoggedIn, function(req, res) {
  res.render('buyads.ejs', {
    user: req.user
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

function returnErr(res,message,err){
  res.render('error.ejs',{
    message:message,
    error:err
  })
}
module.exports = router;

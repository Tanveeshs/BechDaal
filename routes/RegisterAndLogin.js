//jshint esversion:6
//Done
const {
  User
} = require('../model/user');
const Category = require('../model/category').CategoryModel;

let pageCounter = require('../utils/pageCounter')


module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    pageCounter.incrementPageCount()
    Category.find({},{name:1,image:1},function (err, result) {
      if (err) {
        console.log(err);
        return returnErr(res, "Error", "Our server ran into an error please try again")
      }
      res.render('index.ejs', {
        user: req.user,
        categries:result,
      });
    });
  });

  app.get('/login',isNotLoggedIn,function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/login',isNotLoggedIn, passport.authenticate('local-login', {
    successRedirect: '/verify', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.get('/signup',isNotLoggedIn,function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/verify', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));


  //Use projections
  app.get('/verify',isLoggedIn, function(req, res) {
    User.findOne({
      'local.email': req.user.local.email
    },{'local.email':1,'local.isVerified':1}, function(err, user) {
      if (user.local.isVerified) {
        res.redirect('/');
      } else {
        res.render('verify.ejs', {
          user: req.user // get the user out of session and pass to template
        });
      }
    });
  });
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));
  app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login'
      }));
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));
  // the callback after google has authenticated the user
  app.get('/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
      }));
};

function isLoggedIn(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  } catch (e) {
    console.log(e);
  }
}

function isNotLoggedIn(req,res,next){
  try {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }catch (e){
    console.log(e)
  }
}
function returnErr(res,message,err){
  res.render('error.ejs',{
    message:message,
    error:err
  })
}

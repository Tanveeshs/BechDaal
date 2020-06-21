//jshint esversion:6

<<<<<<< HEAD
module.exports = function (app, passport) {
    app.get('/', function (req, res) {
        res.render('index.ejs', { user: undefined });
=======
module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    res.render('index.ejs', {
      user: undefined
>>>>>>> 2102fc9a04c79cdf40b5a536ad140fc18e14f6fa
    });
});

app.get('/login', function (req, res) {
    app.get('/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

<<<<<<< HEAD
    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
        console.log(req.body);
=======
  app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
>>>>>>> 2102fc9a04c79cdf40b5a536ad140fc18e14f6fa
    });
});

app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/verify', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

<<<<<<< HEAD
app.get('/verify', function (req, res) {
    res.render('verify.ejs', {
        user: req.user // get the user out of session and pass to template
    });
=======
  app.get('/verify', function(req, res) {
    res.render('verify.ejs', {
      user: req.user // get the user out of session and pass to template
>>>>>>> 2102fc9a04c79cdf40b5a536ad140fc18e14f6fa
});
  });

<<<<<<< HEAD
app.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile.ejs', {
        user: req.user // get the user out of session and pass to template
    });
    console.log(req)
=======
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user // get the user out of session and pass to template
>>>>>>> 2102fc9a04c79cdf40b5a536ad140fc18e14f6fa
});
console.log(req);
  });



<<<<<<< HEAD
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
//
// app.get('/auth/facebook', passport.authenticate('facebook', {
//     scope: ['email']
// }));
// app.get('/auth/facebook/callback',
//     passport.authenticate('facebook', {
//         successRedirect: '/profile',
//         failureRedirect: '/'
//     }));\

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
=======
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  //
  // app.get('/auth/facebook', passport.authenticate('facebook', {
  //     scope: ['email']
  // }));
  // app.get('/auth/facebook/callback',
  //     passport.authenticate('facebook', {
  //         successRedirect: '/profile',
  //         failureRedirect: '/'
  //     }));\

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  // the callback after google has authenticated the user
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/profile',
      failureRedirect: '/'
>>>>>>> 2102fc9a04c79cdf40b5a536ad140fc18e14f6fa
}));



};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');

}

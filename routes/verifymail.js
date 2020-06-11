//jshint esversion:6

const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const user = require('../model/user');
const mail = require('../utils/mailer');
const User = require('../model/user')();
// var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
//     ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// app.get('/', isLoggedIn, function(req, res) {
//     res.render('verify.ejs', {
//         user: req.user // get the user out of session and pass to template
//     });
// });

router.post('/verifyMail', function(req, res) {
  var secret = 'fe1a1915a379f3be5394b64d14794932';
console.log(req.body.email)
  if (req.body.email !== '') {
    user.findOne({
      'local.email': req.body.email
    }, function(err, result) {


      if (err) {
        console.log(err);
      }
      if (result == null) {
        res.send('Email not found');
      } else {
        const emailAddress = req.body.email;
        // console.log(result._id)
        // var date = Date.now();
        // date += (5 * 60 * 1000);
        const payload = {
          id: result._id,
          email: emailAddress,
          // endDate: date
        };
        var token = jwt.encode(payload, secret);
        console.log(token);
        // let content = 'http://'+ip+':'+port+'/user/resetpassword/'+payload.id+'/'+token
        //For locally uncomment this
        let content = 'http://localhost:3000/verify/verifyMail/' + payload.id + '/' + token;
        mail(emailAddress, content);
        res.send('Mail Sent Successfully');
        val = true;
      }
    });
  } else {
    res.send('Enter an email');
  }

});

router.get('/verifyMail/:id/:token', function(req, res) {
  var secret = 'fe1a1915a379f3be5394b64d14794932';
  console.log(req.params.token);
  var payload = jwt.decode(req.params.token, secret);
  // user.findOneAndUpdate({_id:payload.id}, { isVerified: true });
  user.findById(payload.id, function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result == null) {
      res.send('INCORRECT');
    }
    else{
      result.local.isVerified = true;
      result.save();
    }

});
    res.render('profile.ejs', {
      user: req.user
    });


});

// router.post('/resetpassword', function(req, res) {
//   user.findById(req.body.id, function(err, result) {
//     if (err) {
//       console.log(err);
//     }
//     if (result == null) {
//       res.send('INCORRECT');
//     } else {
//       const pass = User.generateHash(req.body.password);
//       result.local.password = pass;
//       result.save();
//     }
//   });
//
//   res.send('Your password has been successfully changed.');
// });

module.exports = router;
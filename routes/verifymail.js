//jshint esversion:6
//requiring express,router,jet and mail
const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');

const mail = require('../utils/mailer');
const {
  User
} = require('../model/user');


//After mail sent Page Left
router.post('/verifyMail', function(req, res) {
  var secret = 'fe1a1915a379f3be5394b64d14794932';
  //checking for existing mail in database
  if (req.body.email !== '') {
    User.findOne({
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
        var date = Date.now();
        date += (24 * 60 * 60 * 1000);
        const payload = {
          id: result._id,
          email: emailAddress,
          endDate: date
        };
        var token = jwt.encode(payload, secret);
        let url = 'https://bechdaal.tech/verify/verifyMail/' + payload.id + '/' + token;
        let content = `<p>Hey User,</p>
                        <p><br></p>
                        <p>You are just one step away from the best Homemade Food Platform.</p>
                        <p><br></p>
                        <p><span style="color: rgb(44, 130, 201);"><a href="${url}">Click here</a></span> to Verify your mail and unleash happiness.</p>
                        <p><br></p>
                        <p>If the above link doesn&#39;t work manually paste this link in your browser</p>
                        <p><span style="font-size: 12px;">${url}</span></p>
                        <p><br></p>
                        <p>-Team Bech Daal</p>`

        mail(emailAddress,'Verify your E-Mail Address', content);
        res.send('Mail Sent Successfully');
        val = true;
      }
    });
  } else {
    res.send('Enter an email');
  }
});

//handling the link clicked on receiving the confirmation mail
router.get('/verifyMail/:id/:token', function(req, res) {
  var secret = 'fe1a1915a379f3be5394b64d14794932';
  var payload = jwt.decode(req.params.token, secret);
  // user.findOneAndUpdate({_id:payload.id}, { isVerified: true });
  if (payload.endDate < Date.now()) {
    res.send('INVALID LINK');
  } else {
    User.findById(payload.id, function(err, result) {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (result == null) {
        res.send('INCORRECT');
      } else {
        result.local.isVerified = true;
        result.save();
        res.redirect('/');
      }
    });
  }
});



// router.get('/addToChat', function(req, res) {
//   myFirestore
//     .collection('users')
//     .doc(String(req.user._id))
//     .set({
//       id: String(req.user._id),
//       nickname: req.user.local.username,
//       contacts: []
//     })
//     .then(data =>
//       console.log(data));
//   res.render('profile.ejs', {
//     user: req.user
//   });
// });

module.exports = router;

//jshint esversion:6


//Done hai
//Success page banana hai
//Baaki sab done error handling bhi handled
//Secrets ko .env karna hai

const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const {
  User
} = require('../model/user');
const user = require('../model/user')
const mail = require('../utils/mailer');
const sanitize = require("mongo-sanitize");

router.get('/forgotPassword', function(req, res) {
  res.render('forgot.ejs');
});

//Success Page Banao
router.post('/passwordreset', function(req, res) {
  var secret = 'fe1a1915a379f3be5394b64d14794932';
  if (req.body.email !== '') {
    User.findOne({
      'local.email': sanitize(req.body.email)
    },{_id:1},function(err, result) {
      if (err) {
        return returnErr(res, "Error", "Our server ran into an error please try again")
      }
      if (result == null) {
        return returnErr(res, "Error", "Your Email address isn't found please register")
      } else {
        const emailAddress = req.body.email;
        let date = Date.now();
        date += (30 * 60 * 1000);
        const payload = {
          id: result._id,
          email: emailAddress,
          endDate: date
        };
        var token = jwt.encode(payload, secret);
        console.log(token);
        let link = 'https://bechdaal.tech/forgot/resetpassword/' + payload.id + '/' + token;
        let content = `<!DOCTYPE html>
                          <html>
                          <body class="fr-no-selection">
                              <p>Dear User,</p>
                              <p>Someone has asked to <span class="il">reset</span> the <span class="il">password</span> for your account.<br>If you did not request a <span class="il">password</span> <span class="il">reset</span>, you can disregard this email.<br>No changes have been made to your account.</p>
                              <p>To <span class="il">reset</span> your <span class="il">password</span>, follow this link (or paste into your browser) within the next 30 minutes:&nbsp;</p>
                              <p><a href="${link}">Click here to reset your password</a></p>
                              <p><br></p>
                              <p>-Team Bech Daal</p>
                          </body>
                          </html>`
        mail(emailAddress,'Password Reset',content);
        res.send('Mail Sent Successfully');
      }
    });
  } else {
    return res.render('error.ejs',{
      message:"Error",
      error:"Our Server Ran into an error please try again"
    })
  }
});

router.get('/resetpassword/:id/:token', function(req, res) {
  var secret = 'fe1a1915a379f3be5394b64d14794932';
  var payload = jwt.decode(req.params.token, secret);
  if (payload.endDate < Date.now()) {
    return returnErr(res,'Invalid Link',"Your link must have expired please try again")
  } else {
    res.render('reset.ejs', {
      payload: payload,
      token: req.params.token
    });
  }
});

router.post('/resetpassword', function(req, res) {
  var secret = 'fe1a1915a379f3be5394b64d14794932';
  const token = req.body.token
  const payload = jwt.decode(token,secret)
  if(payload.id===req.body.id){
    User.findOneAndUpdate({_id:sanitize(req.body.id)},
        {$set:{'local.password':user.genPassword(req.body.password)}},
        {new:true,projection:{'local.email':1,_id:0}},
        function(err, result) {
      if (err) {
        return returnErr(res, "Error", "Our server ran into an error please try again")
      }
      if (result == null) {
        return returnErr(res, "Invalid Link", "Please check the link you're trying to reach")
      } else {
        let content = '<!DOCTYPE html>\n' +
            '<html>\n' +
            '\n' +
            '<body class="fr-no-selection">\n' +
            '    <p>Dear User,</p>\n' +
            '    <p>Your password has been successfully reset.</p>\n' +
            '    <p><br></p>\n' +
            '    <p>If this change wasn&#39;t made by you contact support or mail us at</p>\n' +
            '    <p>admin@bechdaal.tech</p>\n' +
            '    <p><br></p>\n' +
            '    <p>-Team Bech Daal</p>\n' +
            '</body>\n' +
            '\n' +
            '</html>'
        mail(result.local.email,'Password Changed',content)
        return res.send('Your password has been successfully changed.');
      }
    });
  }else {
    return returnErr(res, "Invalid Link", "Please check the link you're trying to reach")
  }
});


function returnErr(res,message,err){
  res.render('error.ejs',{
    message:message,
    error:err
  })
}
module.exports = router;

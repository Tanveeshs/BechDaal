//jshint esversion:6

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const configDB = require('./config/database');
const forgotPass = require('./routes/forgotPass');
const verifymail = require('./routes/verifymail');
const adRoute = require('./routes/adRoute');
const searchRoute = require('./routes/searchRoute');
const cors = require('cors');
const category = require('./routes/category');
// const smsverify = require('./routes/sms');
mongoose.connect(configDB.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

require('./config/passport')(passport);

var app = express();
const test = require('./routes/test');
// const xg = require('./routes/searchRoute');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'XYZZ'
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./routes/RegisterAndLogin')(app, passport);

app.get('/show_ad', (req, res) => {
  res.render('show_ad.ejs', {
    user: req.user
  });
});

app.use('/user', forgotPass);
app.use('/verify', verifymail);
app.use('/sell', adRoute);
app.use('/category', category);
app.use('/test', test);
app.use('/search', searchRoute);
app.get('/post', function(req, res) {
  res.render('postAd.ejs');
});
app.get('/asdsad', function(req, res) {
  res.send('fsfad');

});
app.listen(3001, function(err) {
  console.log('Server started');
});

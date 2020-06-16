//jshint esversion:6

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const session = require('express-session');
const configDB = require('./config/database');
const forgotPass = require('./routes/forgotPass');
const verifymail = require('./routes/verifymail');
const category = require('./routes/category');
// const smsverify = require('./routes/sms');
mongoose.connect(configDB.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

require('./config/passport')(passport);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(session({
  secret: 'XYZZ'
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./routes/RegisterAndLogin')(app, passport);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user', forgotPass);
app.use('/verify' , verifymail);
// app.use('/sms',smsverify);
app.use('/category', category);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000,function (err) {
  console.log('Server started');
});

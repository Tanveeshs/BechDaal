//jshint esversion:6

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
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
const categoryRoute = require('./routes/category');
const myprofile = require('./routes/myprofile');
const wishlist = require('./routes/wishlist');
const offers = require('./routes/offers');
const adminRouter = require('./routes/admin')
// const smsverify = require('./routes/sms');



mongoose.connect(configDB.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const fs = require('fs')
var options = {
    key: fs.readFileSync('private.key'),
    cert: fs.readFileSync('certificate.crt')
};


require('./config/passport')(passport);

let app = express();
const test = require('./routes/test');
// const xg = require('./routes/searchRoute');

const bodyParser = require('body-parser')
const http = require("http");
const https = require("https");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var port = process.env.PORT || 8080;
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({
    extended: false
}));
// noinspection JSCheckFunctionSignatures
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
// noinspection JSCheckFunctionSignatures
app.use(session({
    secret: 'XYZZ'
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./routes/RegisterAndLogin')(app, passport);

app.use('/user', forgotPass);
app.use('/verify', verifymail);
app.use('/sell', adRoute);
app.use('/category', categoryRoute);
app.use('/test', test);
app.use('/search', searchRoute);
app.use('/myprofile', myprofile);
app.use('/wish', wishlist);
app.use('/offers', offers);
app.use('/admin',adminRouter)

var https_server = https.createServer(options, app).listen(443, function(err){
    console.log("Node.js Express HTTPS Server Listening on Port 443");
});

var http_server = http.createServer(function(req,res){
    // 301 redirect (reclassifies google listings)
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80, function(err){
    console.log("Node.js Express HTTPS Server Listening on Port 80");
});


// app.listen(3000)
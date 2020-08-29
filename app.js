//jshint esversion:6

const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser')
const http = require("http");
const cors = require('cors');
const cron = require("node-cron");
dotenv.config();
const configDB = require('./config/database');
mongoose.connect(configDB.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
});


const PORT = process.env.PORT || 8080;
require('./config/passport')(passport);
let app = express();
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({
    extended: false
}));
// noinspection JSCheckFunctionSignatures
app.use(cookieParser());
// noinspection JSCheckFunctionSignatures
app.use(session({
    secret: 'BechDaal'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.use(cors());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



const forgotPass = require('./routes/forgotPass');
const verifymail = require('./routes/verifymail');
const adRoute = require('./routes/adRoute');
const searchRoute = require('./routes/searchRoute');
const categoryRoute = require('./routes/category');
const myprofile = require('./routes/myprofile');
const wishlist = require('./routes/wishlist');
const offers = require('./routes/offers');
const adminRouter = require('./routes/admin')
const ratingsAndReviews = require('./routes/RatingsAndReviews')
const payment = require('./routes/payment')
const docsRouter = require('./routes/docs')
const sitemapRouter = require('./routes/sitemap')
const contactRouter = require('./routes/contact')

// const test = require('./routes/test');
// const smsverify = require('./routes/sms');
// const xg = require('./routes/searchRoute');




// view engine setup
require('./routes/RegisterAndLogin')(app, passport);

app.use('/forgot', forgotPass);
app.use('/verify', verifymail);
app.use('/sell', adRoute);
app.use('/category', categoryRoute);
// app.use('/test', test);
app.use('/search', searchRoute);
app.use('/myprofile', myprofile);
app.use('/wish', wishlist);
// app.use('/offers', offers);
app.use('/admin',adminRouter)
app.use('/payment',payment)
app.use('/reviews',ratingsAndReviews)
app.use('/docs',docsRouter)
app.use('/sitemap',sitemapRouter)
app.use('/contact',contactRouter)


app.get('/test',(req,res)=>{
    res.render('category.ejs')
})
app.get('/test2',(req,res)=>{
    res.render('contactus.ejs')
})

//DONT DELETE
//USED TO REDIRECT UNMASKED URLS
app.get("*",(req,res)=>{
    res.redirect("/")
})

let redis = require('./config/redisConfig').redis
cron.schedule("0 0 * * *", function() {
  redis.set("DailyCount",0)
})

//for app engine
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});


//for compute engine
// app.use(forceSsl);
// var https_server = https.createServer(options, app).listen(443, function(err){
//     console.log("Node.js Express HTTPS Server Listening on Port 443");
// });
// var http_server = http.createServer(app).listen(80, function(err){
//     console.log("Node.js Express HTTPS Server Listening on Port 80");
// });

//local test

// var http_server = http.createServer(app).listen(3000, function(err){
//     console.log("Node.js Express HTTPS Server Listening on Port 300to app0");
// });

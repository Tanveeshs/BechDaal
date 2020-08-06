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
const category = require('./model/category')
mongoose.connect(configDB.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

require('./config/passport')(passport);

let app = express();
const test = require('./routes/test');
// const xg = require('./routes/searchRoute');
const fs = require('fs')
const bodyParser = require('body-parser')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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

app.get('/test1',function (req,res){
    const a1 = new category.CategoryModel()
    a1.name = 'Cars'
    a1.subcategory = ['Cars',
        'Commercial & Other Vehicles',
        'Spare Parts']
    a1.image = {
        data:fs.readFileSync(__dirname+'/category/car.png'),
        contentType:'image/png'
    }
    a1.save(function (err,data) {
        console.log(data)
    })
    res.send('Done')
})


app.listen(3001, function(err) {
    if(err)
        console.log(err)
    console.log('Server started');
});

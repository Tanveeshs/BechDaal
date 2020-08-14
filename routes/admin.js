//DO NOT TOUCH

const express = require('express')
const Router = express.Router();
const jwt = require('jsonwebtoken')
const ad = require('../model/ad')
const bodyParser = require('body-parser');
const multer = require('multer');
const Category = require('../model/category').CategoryModel
const User = require('../model/user').User;
const users = [
    {
        username:'admin',
        password:'admin',
        role:'admin'
    },
    {
        username: 'admin2',
        password: 'admin2',
        role: 'admin'
    }
]
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now())
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('file type not supported'), false);
    }
};
const upload = multer({
    storage:storage,
    fileFilter:fileFilter
})
Router.use(bodyParser.json());
const secret = 'SSSS'
const authenticateJWT = (req, res, next) => {
    const authHeader = req.session.token;
    if (authHeader) {
        jwt.verify(authHeader, secret, (err, user) => {
            if (err) {
                console.log(err)
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.redirect('/admin/login');
    }
};
const offers = require('../model/offer')
const async = require('async')

//Admin Login
Router.get('/login',(req,res)=>{
    res.render('admin/adminLogin.ejs')
})
Router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {

        req.session.token = jwt.sign({ username: user.username,  role: user.role }, secret);
        console.log(req.session)
        res.redirect('home')
    } else {
        res.send('Username or password incorrect');
    }
});

//Routes to view,approve,reject an ad
Router.get('/ads',authenticateJWT,(req,res)=>{
    ad.find({approved:false,"rejected.val":false},function (err,results){
        res.render('admin/adminAds.ejs',{ads:results})
    })
})
Router.post('/ads/approve/:id', authenticateJWT,(req,res)=>{
    const adId = req.params.id;
    ad.findOne({_id:adId},function (err,result) {
        result.approved = true;
        result.save()
        res.redirect('/admin/ads')
    })
})
Router.post('/ads/reject/:id',authenticateJWT,(req,res)=> {
    const adId = req.params.id;
    ad.findOne({_id: adId}, function (err, result) {
        result.rejected.val = true;
        result.rejected.reason = req.body.reason
        console.log(req.body)
        result.save()
        res.redirect('/admin/ads')
    })
})

//Admin HomePage
Router.get('/home', authenticateJWT, (req, res) => {
    res.render('admin/adminPage.ejs')
});

//To add Category
Router.get('/addCategory',authenticateJWT,(req,res)=>{
    res.render('admin/addCategory.ejs')
})
Router.post('/addCategory',authenticateJWT,upload.single('CategoryImage'),(req,res)=>{
    Category.findOne({'name':req.body.category},(err,result)=>{
        if(err){
            console.log(err)
            throw err;
        }
        if(result){
            console.log("Category Exists")
        }
        else {
            var obj = new Category()
            obj.name = req.body.category;
            obj.subcategory = req.body.subCategory.split(',')
            obj.image = req.file.path
            obj.save()
        }
    })
    res.redirect('/admin/home')
})

//View all Categories
Router.get('/category',(req,res)=>{
    Category.find({},(err,result)=>{
        if(err)
            throw err
        res.render('admin/viewCategory.ejs',
            {Categories:result})
    })
})

//Editing the category
Router.route('/category/edit/:id')
    .get(authenticateJWT,(req,res)=>{
        const id = req.params.id;
        Category.findOne({_id:id},(err,result)=>{
            res.render('admin/editCategory.ejs',{Category:result})
        })
    })
    .post(authenticateJWT,upload.single('CategoryImage'),(req,res)=>{
        Category.findOne({_id:req.params.id},(err,result)=>{
            result.name = req.body.category;
            result.subcategory = req.body.subCategory.split(',')
            if(req.file !== undefined){
                result.image = '/'+req.file.filename;
            }
            result.save()
            res.redirect('/admin/home')
        })
    })

//View Active Offers
Router.route('/offers/:search')
    .get(authenticateJWT,(req,res)=> {
        if(req.params.search !== 'all'){
            offers.find({date_expired: {$gte: Date.now()},status:req.params.search}, function (err, results) {
                let userIds = []
                let adIds = []
                let userDict = {}
                let adDict = {}
                results.forEach(offer => {
                    userIds.push(offer.buyer)
                    userIds.push(offer.seller)
                    adIds.push(offer.ad)
                })
                async.parallel([
                    function (callback){
                        User.find({_id: {$in: userIds}}, function (err, users) {
                            users.forEach(user => {
                                userDict[user._id] = user;
                            })
                            callback(null,'Done')
                        })
                    },
                    function (callback){
                        ad.find({_id: {$in: adIds}}, function (err, users) {
                            users.forEach(user => {
                                adDict[user._id] = user;
                            })
                            callback(null,'Done')
                        })
                    }
                ],function (err){
                    if(err){
                        console.log("Error:",err)

                    }
                    let currentOffers=[]
                    results.forEach(offer=>{
                        let off = {
                            ad:adDict[offer.ad].title,
                            buyer:userDict[offer.buyer].local.username,
                            seller:userDict[offer.seller].local.username,
                            status:offer.status,
                            date_expired:offer.date_expired,
                            offer_price:offer.offer_price
                        }
                        currentOffers.push(off)
                    })
                    res.render('admin/adminOffers.ejs',{
                        'offers':currentOffers
                    })
                })


            })
        }
        else {
            offers.find({date_expired: {$gte: Date.now()}}, function (err, results) {
                let userIds = []
                let adIds = []
                let userDict = {}
                let adDict = {}
                results.forEach(offer => {
                    userIds.push(offer.buyer)
                    userIds.push(offer.seller)
                    adIds.push(offer.ad)
                })
                async.parallel([
                    function (callback){
                        User.find({_id: {$in: userIds}}, function (err, users) {
                            users.forEach(user => {
                                userDict[user._id] = user;
                            })
                            callback(null,'Done')
                        })
                    },
                    function (callback){
                        ad.find({_id: {$in: adIds}}, function (err, users) {
                            users.forEach(user => {
                                adDict[user._id] = user;
                            })
                            callback(null,'Done')
                        })
                    }
                ],function (err){
                    if(err){
                        console.log("Error",err)
                    }
                    let currentOffers=[]
                    results.forEach(offer=>{
                        let off = {
                            ad:adDict[offer.ad].title,
                            buyer:userDict[offer.buyer].local.username,
                            seller:userDict[offer.seller].local.username,
                            status:offer.status,
                            date_expired:offer.date_expired,
                            offer_price:offer.offer_price
                        }
                        currentOffers.push(off)
                    })
                    res.render('admin/adminOffers.ejs',{
                        'offers':currentOffers
                    })
                })
            })
        }
    })

Router.route('/sellers')
    .get(authenticateJWT,(req,res)=>{

        User.find({isSeller:true, IsActive:false,rejected:false},function (err,results){
            if (err){
                console.log(err)
                throw err;
            }
            res.render('admin/viewSellers.ejs',{users:results})
        })
    })

Router.get('/sellers/approve/:id', authenticateJWT,(req,res)=>{
    const adId = req.params.id;
    User.findOneAndUpdate({_id:adId},{$set:{IsActive:true}},function (err) {
        if(err){
            throw err;
        }
        res.redirect('/admin/sellers')
    })
})
Router.get('/sellers/reject/:id',authenticateJWT,(req,res)=> {
    const adId = req.params.id;
    User.findOneAndUpdate({_id: adId},{$set:{rejected:true}}, function (err,) {
        if(err){
            console.log(err)
            throw err
        }
        res.redirect('/admin/sellers')
    })
})


module.exports = Router
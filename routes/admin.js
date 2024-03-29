//DO NOT TOUCH

const express = require('express')
const Router = express.Router();
const jwt = require('jsonwebtoken')
const redis = require('../config/redisConfig').redis
const mail = require('../utils/mailer');

const ad = require('../model/ad')
const bodyParser = require('body-parser');
const multer = require('multer');
const Category = require('../model/category').CategoryModel
const User = require('../model/user').User;
const async = require('async')
const helpAndSupport = require('../model/helpandsupport')
const Storage = require('../config/cloudStorage');
const user = require('../model/user');
const users = [
    {
        username:process.env.admin_user,
        password:process.env.admin_pass,
        role:'admin'
    },
]
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('file type not supported'), false);
    }
};
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: fileFilter
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

//Admin Login
Router.get('/login',(req,res)=>{
    res.render('admin/adminLogin.ejs')
})
Router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        req.session.token = jwt.sign({ username: user.username,  role: user.role }, secret);
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
    ad.findOneAndUpdate({_id:adId},{approved:true},{new:true},function (err,newAd) {
        if(err){
            console.log(err)
        }
        let email;
        if(newAd.user.LoginType==='Local'){
            email = newAd.user.local.email;
        }
        if(newAd.user.LoginType==='Google'){
            email = newAd.user.google.email;
        }
        if(newAd.user.LoginType==='Facebook'){
            email = newAd.user.facebook.email;
        }
        let content = `<p>Hey there ,</p>
    <p>Congratulations ! Your ad is accepted.&nbsp;</p>
    <p>You can have a look of your ad on &nbsp;Bechdaal website and can post more ads there .</p>
    <p>Please do not forward this email to anyone as it contains sensitive information related to your account .</p>
    <p>Have a wonderful day !</p>
    <p><br></p>
    <p>Sincerely,</p>
    <p>BechDaal Team&nbsp;</p>`
        mail(email,'Your Ad is Accepted', content);
        res.redirect('/admin/ads')
    })

})

Router.post('/ads/reject/:id',authenticateJWT,(req,res)=> {
    const adId = req.params.id;
    ad.findOneAndUpdate({_id: adId},
        {$set:{'rejected.val':true,'rejected.reason':req.body.reason}},{new:true},
        function (err, result) {
            if(err){
                console.log("Error Occurred")
            }
            let email;
            if(result.user.LoginType==='Local'){
                email = result.user.local.email;
            }
            if(result.user.LoginType==='Google'){
                email = result.user.google.email;
            }
            if(result.user.LoginType==='Facebook'){
                email = result.user.facebook.email;
            }
            let content = `<p>Hey there ,</p>
      <p>Sorry to inform you that your ad:${result.title} on BechDaal is rejected.</p>
      <p>Reason for Rejection:${req.body.reason}</p>
      <p>If you have any concerns regarding the Ad Please contact Help and Support Center of BechDaal .</p>
      <p>Please do not forward this email to anyone as it contains sensitive information related to your account .</p>
      <p>Have a wonderful day !</p>
      <p><br></p>
      <p>Sincerely,</p>
      <p>BechDaal Team&nbsp;</p>`
            mail(email,'Your Ad is Rejected', content)
            if(result.isPaid===0) {
                User.findOneAndUpdate({_id: String(result.user._id)}, {$inc: {noOfFreeAds: 1}},{new:true}, function (err,user) {
                    if (err) {
                        console.log(err)
                    }
                })
            }
            if(result.isPaid===1){
                User.findOneAndUpdate({_id:String(result.user._id)},{$inc:{noOfPaidAds: 1}},{new:true},function (err){
                    if(err){
                        console.log(err)
                    }
                })
            }
            if(result.isPaid===2){
                User.findOneAndUpdate({_id:String(result.user._id)},{$inc:{noOfFeaturedAds: 1}},{new:true},function (err){
                    if(err){
                        console.log(err)
                    }
                })
            }
            res.redirect('/admin/ads')
        })

})
Router.get("/ads/details",authenticateJWT,function (req,res){
    res.render("admin/adminAdDetails.ejs")
})
Router.post("/ads/details",authenticateJWT,(req,res)=>{
    ad.findById(req.body.adId,function (err,doc){
        if(err){
            console.log(err)
        }
        res.send(doc)
    })
})

//Admin HomePage
Router.get('/home', authenticateJWT, (req, res) => {
    async.parallel({
        getTotalViews:function (callback){
            redis.get("Count",(err,reply)=>{
                if(err){
                    console.log("error in getting data from redis",err)
                    callback(err,null)
                }
                callback(null,reply)
            })
        },
        getDailyViews:function (callback){
            redis.get("DailyCount",(err,reply)=>{
                if(err){
                    console.log("error in getting data from redis",err)
                    callback(err,null)
                }
                callback(null,reply)
            })
        }
    },function (err,cb){
        res.render("admin/adminPage.ejs",{
            pageViews:cb.getTotalViews,
            DailyPageViews:cb.getDailyViews
        })
    })



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
            const bucket = Storage.bucket('bechdaal_bucket')
            const { originalname, buffer } = req.file
            const blob = bucket.file('category_images/' + originalname.replace(/ /g, "_"))
            const blobStream = blob.createWriteStream({
                resumable: false
            })
            blobStream.on('finish', () => {
                obj.image = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                obj.save()
            }).on('error', (err) => {
                console.log("Error")
            }).end(buffer)
        }

    })
    res.redirect('/admin/home')
})

//View all Categories
Router.get('/category',authenticateJWT,
    (req,res)=>{
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
            if(req.file){
                const bucket = Storage.bucket('bechdaal_bucket')
                const { originalname, buffer } = req.file
                const blob = bucket.file('category_images/' + originalname.replace(/ /g, "_"))
                const blobStream = blob.createWriteStream({
                    resumable: false
                })
                blobStream.on('finish', () => {
                    result.image = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                    result.save()
                }).on('error', (err) => {
                    console.log("Error")
                }).end(buffer)
            }
            else {
                result.save()
            }

        }).then(()=>{
            res.redirect('/admin/home')
        })
    })

Router.get('/support',authenticateJWT,(req,res)=>{
    helpAndSupport.find({status:"Open"},function (err,results){
        if(err){
            return res.send("Some error occurred")
        }
        res.render('admin/helpAndSupport.ejs',{
            queries:results
        });
    })
})

Router.post('/support',authenticateJWT,(req,res)=>{
    helpAndSupport.findOneAndUpdate({_id:req.body.complaintId},{$set:{status:"Closed",resolution:req.body.resolution}},function (err,results){
        if(err){
            return res.send("Some error occurred")
        }
        res.redirect('/admin/support')
    })
})


module.exports = Router



//View Active Offers
// Router.route('/offers/:search')
//     .get(authenticateJWT,(req,res)=> {
//         if(req.params.search !== 'all'){
//             offers.find({date_expired: {$gte: Date.now()},status:req.params.search}, function (err, results) {
//                 let userIds = []
//                 let adIds = []
//                 let userDict = {}
//                 let adDict = {}
//                 results.forEach(offer => {
//                     userIds.push(offer.buyer)
//                     userIds.push(offer.seller)
//                     adIds.push(offer.ad)
//                 })
//                 async.parallel([
//                     function (callback){
//                         User.find({_id: {$in: userIds}}, function (err, users) {
//                             users.forEach(user => {
//                                 userDict[user._id] = user;
//                             })
//                             callback(null,'Done')
//                         })
//                     },
//                     function (callback){
//                         ad.find({_id: {$in: adIds}}, function (err, users) {
//                             users.forEach(user => {
//                                 adDict[user._id] = user;
//                             })
//                             callback(null,'Done')
//                         })
//                     }
//                 ],function (err){
//                     if(err){
//                         console.log("Error:",err)
//
//                     }
//                     let currentOffers=[]
//                     results.forEach(offer=>{
//                         let off = {
//                             ad:adDict[offer.ad].title,
//                             buyer:userDict[offer.buyer].local.username,
//                             seller:userDict[offer.seller].local.username,
//                             status:offer.status,
//                             date_expired:offer.date_expired,
//                             offer_price:offer.offer_price
//                         }
//                         currentOffers.push(off)
//                     })
//                     res.render('admin/adminOffers.ejs',{
//                         'offers':currentOffers
//                     })
//                 })
//
//
//             })
//         }
//         else {
//             offers.find({date_expired: {$gte: Date.now()}}, function (err, results) {
//                 let userIds = []
//                 let adIds = []
//                 let userDict = {}
//                 let adDict = {}
//                 results.forEach(offer => {
//                     userIds.push(offer.buyer)
//                     userIds.push(offer.seller)
//                     adIds.push(offer.ad)
//                 })
//                 async.parallel([
//                     function (callback){
//                         User.find({_id: {$in: userIds}}, function (err, users) {
//                             users.forEach(user => {
//                                 userDict[user._id] = user;
//                             })
//                             callback(null,'Done')
//                         })
//                     },
//                     function (callback){
//                         ad.find({_id: {$in: adIds}}, function (err, users) {
//                             users.forEach(user => {
//                                 adDict[user._id] = user;
//                             })
//                             callback(null,'Done')
//                         })
//                     }
//                 ],function (err){
//                     if(err){
//                         console.log("Error",err)
//                     }
//                     let currentOffers=[]
//                     results.forEach(offer=>{
//                         let off = {
//                             ad:adDict[offer.ad].title,
//                             buyer:userDict[offer.buyer].local.username,
//                             seller:userDict[offer.seller].local.username,
//                             status:offer.status,
//                             date_expired:offer.date_expired,
//                             offer_price:offer.offer_price
//                         }
//                         currentOffers.push(off)
//                     })
//                     res.render('admin/adminOffers.ejs',{
//                         'offers':currentOffers
//                     })
//                 })
//             })
//         }
//     })

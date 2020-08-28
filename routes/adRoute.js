//jshint esversion:8


const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const async = require('async');
const sanitize = require('mongo-sanitize');

const storage = require('../config/cloudStorage');
const adRouter = express.Router();
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('file type not supported'), false);
    }
};
const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: fileFilter
}).array('images', 12);

const Ads = require('../model/ad');
const {
    User
} = require('../model/user');

adRouter.use(bodyParser.json());




/* docs */
// while using the post route, you have to use formdata as you are also passing a file (image) and you can't do that in a normal body object
// also, formdata only supports string fields or file format fields, so you can not put nested objects in the body
// so, you have to first turn the user's data (which is a JS object) into a string using JSON.stringify() method and pass that as a field in the ad schema
// here in the backend, the code will turn that string back into object using JSON.parse() method

// adRouter.get('/post',isLoggedIn, function(req, res) {
//   res.render('postAd.ejs',{
//     user:req.user
//   });
// });


//restrict myads only to a seller

adRouter.get('/', isLoggedIn,isSeller,(req, res) => {

    Ads.find({
        'user._id': req.user._id
    }, (err, ads) => {
        res.render('myAds', {
            ads: ads,
            user: req.user
        });
    });
});

//What is this API for??
adRouter.get('/ad/ad', isLoggedIn, (req, res) => {
    Ads.find({
        'user._id': req.user._id
    }, (err, ads) => {
        res.send(ads);
        // res.json(ads)
    });
});

//WHAT IS THIS API FOR??
adRouter.get('/ad/ad/:adid', isLoggedIn, (req, res) => {
    Ads.find({
        _id: req.params.adid
    }, (err, ads) => {
        res.send(ads);
        // res.json(ads)
    });
});

//The get route of PostAd Page
adRouter.get('/ads/post', isLoggedIn,isSeller,function(req, res) {
    res.render('postAd.ejs', {
        user: req.user
    });
});
//DONE
//MAKE AN ERROR PAGE
adRouter.post('/',isLoggedIn,isSeller,(req, res) => {
    multerMid(req, res,(err) => {
        console.log(req.files)
        console.log(req.body)
        if (req.body.featured) {
            if (req.user.noOfFeaturedAds > 0) {
                if (err) {
                    console.log('Error: ', err);
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        msg: 'error'
                    });
                }
                else {
                    let cover_photo = '';
                    let remaining_images = [];
                    async.forEachOf(req.files, function (file, i, callback) {
                            console.log(i);
                            const bucket = storage.bucket('bechdaal_bucket');
                            const {
                                originalname,
                                buffer
                            } = file;

                            let re = /(?:\.([^.]+))?$/;
                            let ext = re.exec(originalname)[1]
                            const fileName = Date.now()+'.'+ext;
                            console.log(fileName)
                            const blob = bucket.file('ad_images/' + fileName.replace(/ /g, "_"));

                            const blobStream = blob.createWriteStream({
                                resumable: false
                            });
                            blobStream.on('finish', () => {
                                if (i === 0) {
                                    cover_photo = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                                } else {
                                    remaining_images.push(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
                                }
                                callback(null);
                            }).on('error', (err) => {
                                callback(err)
                            }).end(buffer);
                        },
                        function (err) {
                            if (err) {
                                console.log(err);
                                res.send('ERROR');
                            } else {
                                console.log('Images Uploaded');
                                async.parallel({
                                    adUpload: function (callback) {
                                        const new_ad = new Ads({
                                            title: req.body.title,
                                            category: req.body.category,
                                            sub_category: req.body.subcategory,
                                            model: req.body.model,
                                            cover_photo: cover_photo,
                                            price: req.body.price,
                                            user: req.user,
                                            deliverableAreas:req.body.delivery,
                                            featured:true,
                                            isPaid:2,
                                            images: remaining_images,
                                            description: req.body.description,
                                            date_posted: new Date(),
                                            // date_sold: req.body.date_sold
                                        });
                                        new_ad.save()
                                            .then((ad) => {
                                                callback(null, ad)
                                            })
                                            .catch((err) => callback(err, null))
                                    },
                                    userUpdate: function (callback) {
                                        User.findOneAndUpdate({_id: String(req.user._id)}, {$inc: {noOfFeaturedAds: -1}},
                                            {new: true}, function (err, user) {
                                                if (err) {
                                                    callback(err, null)
                                                } else {
                                                    let result = {
                                                        user: user
                                                    }
                                                    callback(null, result)
                                                }
                                            })
                                    }
                                }, function (err, results) {
                                    if (err) {
                                        console.log("Error While Posting Ads",err)
                                    } else {
                                        console.log(results.userUpdate.user)
                                        req.user = results.userUpdate.user
                                        res.render("afterPostAd.ejs",{user:req.user})
                                    }
                                })
                            }
                        });
                }
            }else {
                res.send("You Dont have Featured Ads Buy More")
            }
        } else {
            if(req.user.noOfFreeAds>0){
                if (err) {
                    console.log('Error: ', err);
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        msg: 'error'
                    });
                } else {
                    let cover_photo = '';
                    let remaining_images = [];
                    async.forEachOf(req.files, function (file, i, callback) {
                            console.log(i);
                            const bucket = storage.bucket('bechdaal_bucket');
                            const {
                                originalname,
                                buffer
                            } = file;
                            let re = /(?:\.([^.]+))?$/;
                            let ext = re.exec(originalname)[1]
                            const fileName = Date.now()+'.'+ext;
                            console.log(fileName)
                            const blob = bucket.file('ad_images/' + fileName.replace(/ /g, "_"));

                            const blobStream = blob.createWriteStream({
                                resumable: false
                            });
                            blobStream.on('finish', () => {
                                if (i === 0) {
                                    cover_photo = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                                } else {
                                    remaining_images.push(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
                                }
                                callback(null);
                            }).on('error', (err) => {
                                callback(err)
                            }).end(buffer);
                        },
                        function (err) {
                            if (err) {
                                console.log(err);
                                res.send('ERROR');
                            } else {
                                console.log('Images Uploaded');
                                async.parallel({
                                    adUpload: function (callback) {
                                        const new_ad = new Ads({
                                            title: req.body.title,
                                            category: req.body.category,
                                            sub_category: req.body.subcategory,
                                            model: req.body.model,
                                            cover_photo: cover_photo,
                                            price: req.body.price,
                                            deliverableAreas:req.body.delivery,
                                            user: req.user,
                                            featured: false,
                                            images: remaining_images,
                                            isPaid:0,
                                            description: req.body.description,
                                            date_posted: new Date(),
                                            // date_sold: req.body.date_sold
                                        });
                                        new_ad.save()
                                            .then((ad) => {
                                                callback(null, ad)
                                            })
                                            .catch((err) => callback(err, null))
                                    },
                                    userUpdate: function (callback) {
                                        User.findOneAndUpdate({_id: String(req.user._id)}, {$inc: {noOfFreeAds: -1}},
                                            {new: true}, function (err, user) {
                                                if (err) {
                                                    callback(err, null)
                                                } else {
                                                    let result = {
                                                        user: user
                                                    }
                                                    callback(null, result)
                                                }
                                            })
                                    }
                                }, function (err, results) {
                                    if (err) {
                                        console.log("Error While Posting Ads",err)
                                    } else {
                                        console.log(results.userUpdate.user)
                                        req.user = results.userUpdate.user
                                        res.render("afterPostAd.ejs",{user:req.user})
                                    }
                                })
                            }
                        });
                }
            }
            else if(req.user.noOfPaidAds>0){
                if (err) {
                    console.log('Error: ', err);
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        msg: 'error'
                    });
                } else {
                    let cover_photo = '';
                    let remaining_images = [];
                    async.forEachOf(req.files, function (file, i, callback) {
                            console.log(i);
                            const bucket = storage.bucket('bechdaal_bucket');
                            const {
                                originalname,
                                buffer
                            } = file;
                            let re = /(?:\.([^.]+))?$/;
                            let ext = re.exec(originalname)[1]
                            const fileName = Date.now()+'.'+ext;
                            console.log(fileName)
                            const blob = bucket.file('ad_images/' + fileName.replace(/ /g, "_"));

                            const blobStream = blob.createWriteStream({
                                resumable: false
                            });
                            blobStream.on('finish', () => {
                                if (i === 0) {
                                    cover_photo = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                                } else {
                                    remaining_images.push(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
                                }
                                callback(null);
                            }).on('error', (err) => {
                                callback(err)
                            }).end(buffer);
                        },
                        function (err) {
                            if (err) {
                                console.log(err);
                                res.send('ERROR');
                            } else {
                                console.log('Images Uploaded');
                                async.parallel({
                                    adUpload: function (callback) {
                                        const new_ad = new Ads({
                                            title: req.body.title,
                                            category: req.body.category,
                                            sub_category: req.body.subcategory,
                                            model: req.body.model,
                                            cover_photo: cover_photo,
                                            deliverableAreas:req.body.delivery,
                                            price: req.body.price,
                                            user: req.user,
                                            featured: false,
                                            isPaid:1,
                                            images: remaining_images,
                                            description: req.body.description,
                                            date_posted: new Date(),
                                            // date_sold: req.body.date_sold
                                        });
                                        new_ad.save()
                                            .then((ad) => {
                                                callback(null, ad)
                                            })
                                            .catch((err) => callback(err, null))
                                    },
                                    userUpdate: function (callback) {
                                        User.findOneAndUpdate({_id: String(req.user._id)}, {$inc: {noOfPaidAds: -1}},
                                            {new: true}, function (err, user) {
                                                if (err) {
                                                    callback(err, null)
                                                } else {
                                                    let result = {
                                                        user: user
                                                    }
                                                    callback(null, result)
                                                }
                                            })
                                    }
                                }, function (err, results) {
                                    if (err) {
                                        console.log("Error While Posting Ads",err)
                                    } else {
                                        console.log(results.userUpdate.user)
                                        req.user = results.userUpdate.user
                                        res.render("afterPostAd.ejs",{user:req.user})
                                    }
                                })
                            }
                        });
                }
            }
            else {
                res.send("You Dont have Ads Buy More")
            }
        }
    })
})

//DONE
//ERROR PAGE LEFT
adRouter.post('/editad/view', isLoggedIn,isSeller,(req, res) => {
    Ads.find({
        _id: sanitize(req.body.adid),
        'user._id': String(req.user._id)
    }, (err, ad) => {
        console.log(req.body.adid);
        if (ad) {
            res.render('editad', {
                ad: ad,
                user: req.user
            });
        } else {
            res.send("Error");
        }
    });
});

//Files Nai aari is request mein Check karo
adRouter.post('/editad', (req, res) => {
    multerMid(req, res,(err) => {
        if(err){
            console.log(err)
            res.send("Error")
        }
        console.log(req.files)
        console.log(req.body)
        Ads.findOne({_id:sanitize(req.body.adid)},function (err,ad){
            let featured = ad.featured
            if(req.body.featured && !featured){
                User.findById({_id:String(req.user._id)},function (err,user){
                    if(user.noOfFeaturedAds>0){
                        user.noOfFeaturedAds = user.noOfFeaturedAds-1;
                        if(ad.isPaid===1){
                            user.noOfPaidAds = user.noOfPaidAds+1
                        }
                        else{
                            user.noOfFreeAds = user.noOfFreeAds+1
                        }
                        ad.save()
                        user.save()
                        req.user = user
                        editAd(req,res,2,true)
                    }
                    else {
                        res.send("No Featured Ads Available")
                    }
                })
            }
            else if(req.body.featured === undefined && ad.featured){
                User.findById({_id:String(req.user._id)},function (err,user){
                    if(user.noOfPaidAds>0 || user.noOfFreeAds>0){
                        let isPaid;
                        if(user.noOfFreeAds>0){
                            user.noOfFreeAds = user.noOfFreeAds-1
                            isPaid=0
                        }
                        else {
                            user.noOfPaidAds = user.noOfPaidAds-1
                            isPaid=1
                        }
                        user.noOfFeaturedAds = user.noOfFeaturedAds+1;
                        user.save()
                        req.user = user;
                        editAd(req,res,isPaid,false)
                    }
                    else {
                        res.send("No Free or Paid Ads Available")
                    }
                })
            }
            else {
                editAd(req,res,ad.isPaid,ad.featured)
            }
        })

    })
});
function editAd(req,res,isPaid,featured){

    if(req.body.updateImages){
        let cover_photo = '';
        let remaining_images = [];
        console.log(req.files)
        async.forEachOf(req.files, function (file, i, callback) {
            console.log(i);
            const bucket = storage.bucket('bechdaal_bucket');
            const {
                originalname,
                buffer
            } = file;
            let re = /(?:\.([^.]+))?$/;
            let ext = re.exec(originalname)[1]
            const fileName = Date.now()+'.'+ext;
            console.log(fileName)
            const blob = bucket.file('ad_images/' + fileName.replace(/ /g, "_"));

            const blobStream = blob.createWriteStream({
                resumable: false
            });
            blobStream.on('finish', () => {
                if (i === 0) {
                    cover_photo = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                } else {
                    remaining_images.push(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
                }
                callback(null);
            }).on('error', (err) => {
                callback(err)
            }).end(buffer);
        },function (err) {
            if(err){
                res.send("Error While Uploading Images")
            }
            else {
                Ads.findOneAndUpdate({_id:sanitize(req.body.adid)}, {
                    '$set': {
                        'title': req.body.title,
                        'category': req.body.category,
                        'sub_category': req.body.subcategory,
                        'model': req.body.model,
                        'price': req.body.price,
                        'user': req.user,
                        'cover_photo':cover_photo,
                        'images':remaining_images,
                        'description': req.body.description,
                        'approved': false,
                        'featured':featured,
                        'isPaid':isPaid
                    }
                },function (err,docs) {
                    if(err){
                        res.send("Error While Updating Ad")
                    }
                    if(docs){
                        res.render('afterPostAd')
                    }
                    else {
                        res.send("Not Found")
                    }
                })
            }
        })
    }
    else {
        Ads.findOne({_id:sanitize(req.body.adid)},function (err,ad){
            let change=0
            if(ad.title !== req.body.title){
                console.log("Title Changed")
                ad.title = req.body.title;
                change=1
            }
            if(ad.category !== req.body.category){
                console.log("Category Changed")
                ad.category = req.body.category;
                change=1
            }
            if(ad.sub_category !== req.body.subcategory){
                console.log("SubCategory Changed")
                ad.sub_category = req.body.subcategory;
                change=1
            }
            if(ad.model !== req.body.model){
                console.log("Model Changed")
                ad.model = req.body.model;
                change=1
            }
            if(ad.brand !== req.body.brand){
                ad.brand = req.body.brand;
                change=1
            }
            if(ad.description !== req.body.description){
                ad.description = req.body.description;
                change=1
            }
            let isActive= false
            if(req.body.isActive){
                isActive=true
            }
            if(change===1){
                ad.approved=false
                ad.isPaid = isPaid
                ad.featured = featured
                ad.isActive = isActive
                ad.price = req.body.price
                ad.save()
                res.render("afterPostAd.ejs")
            }
            else {
                ad.isPaid = isPaid
                ad.featured = featured
                ad.price = req.body.price
                ad.isActive = isActive
                res.redirect("/sell")

            }
        })

    }

}

/* docs */
// here you will just add the id of the ad in the url itself, and will get that single ad
//WHAT DOES PUT Route do here??
adRouter.route('/show')
    .post((req, res) => {
        const adId = req.body.adId
        console.log(adId)
        Ads.findOne({_id:adId},function (err,ad){
            if(err){
                console.log(err)
            }
            res.render('show_ad', {
                ad: ad,
                user: req.user
            });

        })
    });


//Thinking to use this to display the ad
// adRouter.post('/show', (req, res) => {
//     Ads.findById(sanitize(req.body.adId))
//         .then((ad) => {
//             // console.log(ad);
//             res.render('show_ad', {
//                 ad: ad,
//                 user: req.user
//             });
//         }).catch((err) => console.log(err));
// });

adRouter.get('/grid_ads/c/:page',(req,res)=>{
    const page = parseInt(req.params.page);
    console.log(page)
        Ads.find({isPaid:2, approved: true, isActive: true, 'rejected.val': false},function (err,docs){
            if(err){
                returnErr(res, "Error", err)
            }
            let count = docs.length;
            console.log(count)
            async.parallel({
                featured:function (callback) {
                    // count=5
                    if((page+1)*3<count+3){
                        if((count-page*3)<3){
                            Ads.find({isPaid:2, approved: true, isActive: true, 'rejected.val': false},{user:0,images:0,brand:0,model:0},
                                function (err,ads) {
                                    if(err){
                                        callback(err,null)
                                    }
                                    else {
                                        callback(null,ads)
                                    }
                                }).limit((count-page*3)).skip(page*3)
                        }else {
                            Ads.find({isPaid:2, approved: true, isActive: true, 'rejected.val': false},{user:0,images:0,brand:0,model:0},
                                function (err,ads) {
                                    if(err){
                                        callback(err,null)
                                    }
                                    else {
                                        callback(null,ads)
                                    }
                                }).limit(3).skip(page*3)
                        }
                    }
                    else {
                        callback(null,null)
                    }
                },
                normal:function (callback){
                    if((page+1)*3<count+3){
                        if((count-page*3)<3){
                            Ads.find({$or:[{isPaid:0},{isPaid:1}], approved: true, isActive: true, 'rejected.val': false},{user:0,images:0,brand:0,model:0},
                                function (err,ads) {
                                    if(err){
                                        callback(err,null)
                                    }
                                    else {
                                        callback(null,ads)
                                    }
                                }).limit(9-(count-page*3)).skip(page*6)
                        }else {
                            Ads.find({$or:[{isPaid:0},{isPaid:1}], approved: true, isActive: true, 'rejected.val': false},{user:0,images:0,brand:0,model:0},
                                function (err,ads) {
                                    if(err){
                                        callback(err,null)
                                    }
                                    else {
                                        callback(null,ads)
                                    }
                                }).limit(6).skip(page*6)
                        }
                    }else {
                        let page2 = page - Math.floor(count/3)
                        Ads.find({$or:[{isPaid:0},{isPaid:1}], approved: true, isActive: true, 'rejected.val': false},{user:0,images:0,brand:0,model:0},

                            function (err,ads) {
                                if(err){
                                    callback(err,null)
                                }
                                else {
                                    callback(null,ads)
                                }
                            }).limit(9).skip(page*6+(page*3-count)+page2*9)
                    }
                }
            },function (err,results){
                if(err){
                    console.log(err)
                    return returnErr(res, "error", "Error")
                }

                let arr=[]
                if(results.featured===undefined && results.normal===undefined){
                    arr = []
                }
                else if(results.featured===null){
                    arr = [...results.normal]
                }
                else if(results.normal===null){
                    arr = [...results.featured]
                }
                else {
                    arr = [...results.featured,...results.normal]
                }
                res.send(arr)
            })
        })
    })


adRouter.route('/grid_ads/a')
    .post((req, res, next) => {

        const page = parseInt(req.body.page);
        console.log(page)
        const featuredLimit = 3;
        const ordinaryLimit = 6;

        const featuredStartIndex = (page - 1) * featuredLimit;
        const ordinaryStartIndex = (page - 1) * ordinaryLimit;

        const featuredEndIndex = page * featuredLimit;
        const ordinaryEndIndex = page * ordinaryLimit;
        Ads.find({},function (err,cb){
            // console.log(cb)
            res.send(cb)
        }).limit(9).sort({date_posted:-1})

        // Ads.find({$and: [
        //         { approved: true },
        //         { 'rejected.val': false },
        //         { isActive: true }
        //     ]})
        //     .sort({date_posted: -1})
        //     .then((ads) => {
        //         const featuredAds = ads.filter((item, index) => (item.isPaid===2));
        //         const ordinaryAds = ads.filter((item, index) => !(item.isPaid===2));
        //
        //         const isFeaturedShort = 3 - (featuredEndIndex - featuredStartIndex);
        //
        //         const paginatedFeaturedAds = featuredAds.slice(featuredStartIndex, featuredEndIndex);
        //         const paginatedOrdinaryAds = ordinaryAds.slice(ordinaryStartIndex, ordinaryEndIndex + isFeaturedShort);
        //
        //         const finalAdsArray = Array.prototype.push.apply(paginatedFeaturedAds, paginatedOrdinaryAds);
        //
        //         let results = {
        //             // featured: paginatedFeaturedAds,
        //             // ordinary: paginatedOrdinaryAds,
        //             ads: finalAdsArray
        //         };
        //
        //         if (featuredEndIndex < featuredAds.length || ordinaryEndIndex < ordinaryAds.length) results.nextPage = page + 1;
        //
        //         if (featuredStartIndex > 0) results.previousPage = page - 1;
        //
        //         res.statusCode = 200;
        //         res.setHeader('Content-Type', 'application/json');
        //         res.json(results);
        //     });
    });

//Send Params adId
//Increments adType in user
//Removes Images From GoogleCloud
adRouter.route('/delete')
    .post(isLoggedIn, isSeller, (req, res)=> {
        Ads.findOne({_id:req.body.adid,'user._id':req.user._id},{_id:1,images:1,isPaid:1,cover_photo:1},
            function (err,ad) {
                //logic to delete the photos from cloud storage
                let cover_photo = ad.cover_photo
                let images = []
                images[0] = cover_photo.replace('https://storage.googleapis.com/bechdaal_bucket/','')
                let imgURL;
                if(ad.images.length>0){
                    for (let i = 0; i < ad.images.length; i++) {
                        imgURL = ad.images[i]
                        imgURL = imgURL.replace('https://storage.googleapis.com/bechdaal_bucket/','')
                        images.push(imgURL)
                    }
                    images.forEach(im=>{
                        storage.bucket('bechdaal_bucket').file(im).delete()
                            .then(()=>{
                                console.log("File Deleted")
                            })
                    })
                }

                if(ad.isPaid===0){
                    User.findOneAndUpdate({_id:String(req.user._id)},{$inc:{noOfFreeAds:1}},{new: true},
                        function(err,user){
                            if(err){
                                return res.send(err)
                            }
                            req.user = user
                        } )
                }
                else if(ad.isPaid===1) {
                    User.findOneAndUpdate({_id:String(req.user._id)},{$inc:{noOfPaidAds:1}},{new: true},
                        function(err,user){
                            if(err){
                                return res.send(err)
                            }
                            req.user = user
                        } )
                }
                else if(ad.isPaid===2){
                    User.findOneAndUpdate({_id:String(req.user._id)},{$inc:{noOfFeaturedAds:1}},{new: true},
                        function(err,user){
                            if(err){
                                return res.send(err)
                            }
                            req.user = user
                        } )
                }

                ad.deleteOne()
                    .then((ad) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({msg: 'ad deleted'});
                    })
                    .catch((err) => console.log(err))
            })
    })


function isLoggedIn(req, res, next) {
    try {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    } catch (e) {
        console.log(e);
    }
}
function isSeller(req,res,next){
    try {
        if (req.user.isSeller) {
            return next();
        }
        res.send("Not a seller");
    } catch (e) {
        console.log(e);
    }
}


function returnErr(res,message,err){
    res.render('error.ejs',{
      message:message,
      error:err
    })
  }

module.exports = adRouter;

//jshint esversion:8

//DONE

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


// for now, the images data is storing the array of whole file objects, not just the url of the pic


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
//DONE
adRouter.get('/', isLoggedIn, (req, res) => {
    if (req.user.isSeller === true) {
        Ads.find({
            'user._id': req.user._id
        }, (err, ads) => {
            res.render('myAds', {
                ads: ads,
                user: req.user
            });
        });
    } else {
        //Add a UI here
        res.send("Incorrect Page");
    }
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


//Changes to Image Upload
//DONE
//MAKE AN ERROR PAGE
//Think yahaan pe If I dont have postable ads I still posted the ad
adRouter.post('/', (req, res) => {
    multerMid(req, res, async (err) => {
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
                            const fileName = originalname + '-' + Date.now();
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
                                            brand: req.body.brand,
                                            cover_photo: cover_photo,
                                            price: req.body.price,
                                            user: req.user,
                                            address: req.body.address,
                                            contact_number: req.body.contact,
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
                                        console.log("Error While Posting Ads")
                                    } else {
                                        console.log(results.userUpdate.user)
                                        req.user = results.userUpdate.user
                                        res.render("afterPostAd.ejs")
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
                            const fileName = originalname + '-' + Date.now();
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
                                            brand: req.body.brand,
                                            cover_photo: cover_photo,
                                            price: req.body.price,
                                            user: req.user,
                                            address: req.body.address,
                                            contact_number: req.body.contact,
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
                                        console.log("Error While Posting Ads")
                                    } else {
                                        console.log(results.userUpdate.user)
                                        req.user = results.userUpdate.user
                                        res.render("afterPostAd.ejs")
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
                            const fileName = originalname + '-' + Date.now();
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
                                            brand: req.body.brand,
                                            cover_photo: cover_photo,
                                            price: req.body.price,
                                            user: req.user,
                                            address: req.body.address,
                                            contact_number: req.body.contact,
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
                                        console.log("Error While Posting Ads")
                                    } else {
                                        console.log(results.userUpdate.user)
                                        req.user = results.userUpdate.user
                                        res.render("afterPostAd.ejs")
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
adRouter.post('/editad/view', isLoggedIn, (req, res) => {
    if (req.user.isSeller === true) {
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
    } else {
        console.log("Error");
        res.send("Error");
    }

});


//CANNOT SET FEATURED YAHAN SE
//EXTERNAL API FOR THAT
//HOW TO UPDATE IMAGES HERE??
adRouter.post('/editad', (req, res) => {
    // const cover_photo = req.files[0];
    // let remaining_images = [];
    // for (let i = 1; i < req.files.length; i++) {
    //   // remaining_images[i - 1] = req.files[i];
    //   remaining_images.push(req.files[i]);
    // }
    if (req.user.isSeller) {
        Ads.findOneAndUpdate({
            _id: sanitize(req.body.adid),
            'user._id': req.user._id
        }, {
            '$set': {
                'title': req.body.title,
                'category': req.body.category,
                'sub_category': req.body.subcategory,
                'model': req.body.model,
                'brand': req.body.brand,
                'price': req.body.price,
                'user': req.user,
                'address': req.body.address,
                'contact_number': req.body.contact,
                'description': req.body.description,
                'approved': false,
            }
        }, function(err) {
            // Updated at most one doc, `res.modifiedCount` contains the number
            // of docs that MongoDB updated
            if (err) {
                console.log(err);
            }
        });
        res.redirect('/sell');
    } else {
        res.send("Error");
    }
});

/* docs */
// here you will just add the id of the ad in the url itself, and will get that single ad
//WHAT DOES PUT Route do here??
adRouter.route('/:adId')
    .get((req, res) => {
        Ads.findById(sanitize(req.params.adId))
            .then((ad) => {
                // console.log(ad);
                res.render('show_ad', {
                    ad: ad,
                    user: req.user
                });
            }).catch((err) => console.log(err));
    });
// .put((req, res) => {
//   Ads.findByIdAndUpdate(req.params.adId, {
//     $set: req.body
//   }, {
//     new: true
//   })
//     .then((ad) => {
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'application/json');
//       res.json(ad);
//     }).catch((err) => console.log(err));
// });


//Thinking to use this to display the ad
adRouter.post('/show', (req, res) => {
    Ads.findById(sanitize(req.body.adId))
        .then((ad) => {
            // console.log(ad);
            res.render('show_ad', {
                ad: ad,
                user: req.user
            });
        }).catch((err) => console.log(err));
});




adRouter.get('/ads/post', isLoggedIn,isSeller,function(req, res) {
    res.render('postAd.ejs', {
        user: req.user
    });
});

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


adRouter.route('/grid_ads/a')
    .get((req, res, next) => {

        const page = parseInt(req.query.page);
        const featuredLimit = 3;
        const ordinaryLimit = 6;

        const featuredStartIndex = (page - 1) * featuredLimit;
        const ordinaryStartIndex = (page - 1) * ordinaryLimit;

        const featuredEndIndex = page * featuredLimit;
        const ordinaryEndIndex = page * ordinaryLimit;


        Ads.find({})
            .then((ads) => {
                const featuredAds = ads.filter((item, index) => item.price > 5000);
                const ordinaryAds = ads.filter((item, index) => item.price < 5000);

                const paginatedFeaturedAds = featuredAds.slice(featuredStartIndex, featuredEndIndex);
                const paginatedOrdinaryAds = ordinaryAds.slice(ordinaryStartIndex, ordinaryEndIndex);

                let results = {
                    featured: paginatedFeaturedAds,
                    ordinary: paginatedOrdinaryAds,
                };

                if (featuredEndIndex < featuredAds.length || ordinaryEndIndex < ordinaryAds.length) results.nextPage = page + 1;

                if (featuredStartIndex > 0) results.previousPage = page - 1;

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(results);
            });
    });

module.exports = adRouter;

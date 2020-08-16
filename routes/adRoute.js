//jshint esversion:6

//DONE

const express = require('express');
const bodyParser = require('body-parser');
const adRouter = express.Router();
const multer = require('multer');
const AdSchema = require('../model/ad');
const Ads = require('../model/ad');
const async = require('async')
const storage = require('../config/cloudStorage')
const sanitize = require('mongo-sanitize');
const { User } = require('../model/user');

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
}).array('images', 12)
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
    res.send("Incorrect Page")
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
adRouter.post('/', (req, res) => {
  multerMid(req, res, async (err) => {
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
        console.log(i)
        const bucket = storage.bucket('bechdaal_bucket')
        const { originalname, buffer } = file
        const blob = bucket.file('ad_images/' + originalname.replace(/ /g, "_"))
        const blobStream = blob.createWriteStream({
          resumable: false
        })
        blobStream.on('finish', () => {
          if (i === 0) {
            cover_photo = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          }
          else {
            remaining_images.push(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
          }
          callback(null)
        }).on('error', (err) => { callback(err) }).end(buffer)
      },
        function (err) {
          if (err) {
            console.log(err)
            res.send('ERROR')
          } else {
            console.log('Images Uploaded')
            const new_ad = new AdSchema({
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
              featured: req.body.featured,
              images: remaining_images,
              description: req.body.description,
              date_posted: new Date(),
              // date_sold: req.body.date_sold
            });
            console.log(new_ad)

            new_ad.save()
              .then((ad) => {

                // decrementing no of free ads available to user
                User.findById(req.user._id)
                  .then((user) => {
                    if (user.noOfFreeAds < 3) {
                      user.noOfFreeAds += 1;
                      user.save()
                        .then((user) => {
                          console.log(`You have now ${3 - user.noOfFreeAds} free ads remaining`);
                        })
                    } else {
                      console.log(`You don't have any free postable ads now`);
                    }
                  })

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(ad);
              })
              .catch((err) => console.log(err));
          }
        })
    }
  });
});


//DONE
//ERROR PAGE LEFT
adRouter.get('/editad/:adid', isLoggedIn, (req, res) => {
  if (req.user.isSeller === true) {
    Ads.find({
      _id: sanitize(req.params.adid)
    }, (err, ad) => {
      res.render('editad', {
        ad: ad,
        user: req.user
      });
    });
  } else {
    console.log("Error")
    res.send("Error")
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
  Ads.findOneAndUpdate({
    _id: sanitize(req.body.adid)
  }, {
    '$set': {
      'title':req.body.title,
      'category': req.body.category,
      'sub_category': req.body.subcategory,
      'model': req.body.model,
      'brand': req.body.brand,
      'price': req.body.price,
      'user': req.user,
      'address': req.body.address,
      'contact_number': req.body.contact,
      'description': req.body.description,
    }
  }, function (err) {
    // Updated at most one doc, `res.modifiedCount` contains the number
    // of docs that MongoDB updated
    if (err) {
      console.log(err);
    }
  });
  res.redirect('/sell');
});

/* docs */
// here you will just add the id of the ad in the url itself, and will get that single ad
//WHAT DOES PUT Route do here??
adRouter.route('/:adId')
  .get((req, res) => {
    AdSchema.findById(sanitize(req.params.adId))
      .then((ad) => {
        // console.log(ad);
        res.render('show_ad', {
          ad: ad,
          user: req.user
        });
      }).catch((err) => console.log(err));
  })
  .put((req, res) => {
    Ads.findByIdAndUpdate(req.params.adId, {
      $set: req.body
    }, {
      new: true
    })
      .then((ad) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(ad);
      }).catch((err) => console.log(err));
  });

adRouter.get('/ads/post', isLoggedIn, function (req, res) {
  res.render('postAd.ejs', {
    user: req.user
  });
});

function isLoggedIn(req, res, next) {
    try {
        if (req.isAuthenticated()) {
            req.isLogged = true;
            return next();
        }
        res.redirect('/login');
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
        }

        if (featuredEndIndex < featuredAds.length || ordinaryEndIndex < ordinaryAds.length) results.nextPage = page + 1

        if (featuredStartIndex > 0) results.previousPage = page - 1;

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(results)
      })
  })

module.exports = adRouter;

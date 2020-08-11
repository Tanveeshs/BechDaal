//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const adRouter = express.Router();
const multer = require('multer');
const AdSchema = require('../model/ad');
const Ads = require('../model/ad');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('file type not supported'), false);
  }
};

const upload = multer({
  storage,
  fileFilter
}).array('images', 12);

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

adRouter.get('/', isLoggedIn, (req, res) => {
  Ads.find({
    'user._id': req.user._id
  }, (err, ads) => {
    res.render('myAds', {
      ads: ads,
      user: req.user
    });
    // res.json(ads)
  });
});

adRouter.get('/ad/ad', isLoggedIn, (req, res) => {
  Ads.find({
    'user._id': req.user._id
  }, (err, ads) => {
    res.send(ads);
    // res.json(ads)
  });
});

adRouter.get('/ad/ad/:adid', isLoggedIn, (req, res) => {
  Ads.find({
    _id: req.params.adid
  }, (err, ads) => {
    res.send(ads);
    // res.json(ads)
  });
});

adRouter.post('/', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log('Error: ', err);
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        msg: 'error'
      });
    } else {
      const cover_photo = req.files[0];
      let remaining_images = [];
      for (let i = 1; i < req.files.length; i++) {
        // remaining_images[i - 1] = req.files[i];
        remaining_images.push(req.files[i]);
      }
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

      new_ad.save()
        .then((ad) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(ad);
        })
        .catch((err) => console.log(err));
    }
  });
});

adRouter.get('/editad/:adid', isLoggedIn, (req, res) => {
  Ads.find({
    _id: req.params.adid
  }, (err, ad) => {
    res.render('editad', {
      ad: ad,
      user: req.user
    });
  });
});

adRouter.post('/editad', (req, res) => {
  // const cover_photo = req.files[0];
  // let remaining_images = [];
  // for (let i = 1; i < req.files.length; i++) {
  //   // remaining_images[i - 1] = req.files[i];
  //   remaining_images.push(req.files[i]);
  // }
  Ads.findOneAndUpdate({
    _id: req.body.adid
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
      'featured': req.body.featured,
      'description': req.body.description,
    }
  }, function (err, res) {
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

adRouter.route('/:adId')
  .get((req, res) => {
    AdSchema.findById(req.params.adId)
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

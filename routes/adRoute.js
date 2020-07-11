//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const adRouter = express.Router();
const multer = require('multer');
const AdSchema = require('../model/ad');
const user = require('../model/user');
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

adRouter.route('/')
  .get((req, res) => {
    Ads.find({
        user: req.user
      })
      .then((ads) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(ads);
      }).catch((err) => console.log(err));
  })

  .post((req, res) => {
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
        let remaining_images = {};
        for (let i = 1; i < req.files.length; i++) {
          remaining_images[i - 1] = req.files[i];
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
          contact_number: req.body.contact_number,
          images: remaining_images,
          description: req.body.description,
          date_posted: new Date(),
          // date_sold: req.body.date_sold
        });

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(new_ad);

        new_ad.save()
          .then((ad) => {
            console.log(ad);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(ad);
          })
          .catch((err) => console.log(err));

      }
    });


  });

/* docs */
// here you will just add the id of the ad in the url itself, and will get that single ad

adRouter.route('/:adId')
  .get((req, res) => {
    AdSchema.findById(req.params.adId)
      .then((ad) => {
        console.log(ad);
        res.render('show_ad', {
          ad: ad
        });
      });
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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    req.isLogged = true;
    return next();
  }
}

module.exports = adRouter;

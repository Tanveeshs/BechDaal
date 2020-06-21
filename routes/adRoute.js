//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const adRouter = express.Router();
const multer = require('multer');
const AdSchema = require('../model/ad');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  file: (req, file, cb) => {
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
});

adRouter.use(bodyParser.json());


// for now, the images data is storing the array of whole file objects, not just the url of the pic
// also, the user that is in the body maybe already JSON, but when i was doing this on a dummy project, i passed it as a string, so i am parsing it in JSON here
adRouter.route('/')
  .post((upload.array('images', 12)), (req, res) => {
    const user_data = JSON.parse(req.body.user);

    const new_ad = new AdSchema({
      title: req.body.title,
      category: req.body.category,
      sub_category: req.body.sub_category,
      model: req.body.model,
      brand: req.body.brand,
      price: req.body.price,
      user: user_data,
      address: req.body.address,
      contact_number: req.body.contact_number,
      images: req.files,
      description: req.body.description,
      date_posted: req.body.date_posted,
      date_sold: req.body.date_sold
    });


    new_ad.save()
      .then((ad) => {
        res.statusCode = 200;
        res.json(ad);
      })
      .catch((err) => console.log(err));

  });


adRouter.route('/:adId')
  .get((req, res) => {
    AdSchema.findById(req.params.adId)
      .then((ad) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(ad);
      }, (err) => console.log(err))
      .catch((err) => console.log(err));
  });
module.exports = adRouter;

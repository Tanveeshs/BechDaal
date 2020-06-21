//jshint esversion:6

const express = require('express');
const router = express.Router();
// const jwt = require('jwt-simple');
const user = require('../model/user');
const Category = require('../model/category').CategoryModel;
// const mail = require('../utils/mailer');
const User = require('../model/user');

router.get('/', function(req, res) {
  Category.find({}, function(err, result) {
    res.send(result);
  });
});

router.get('/:categoryname', function(req, res) {
  // res.send(req.params.categoryname);
  categoryName = req.params.categoryname;
  Category.findOne({
    name: categoryName
  }, function(err, result) {
    if (err) {
      console.log(err);
      res.redirect('/category');
    } else {
      res.json(result);
    }
  });
  // var name1 = new Category({name:categoryName});
  // name1.save();
});

router.get('/:categoryname/:subcategoryname', function(req, res) {
  // res.send(req.params.categoryname);
  categoryName = req.params.categoryname;
  subcategoryName = req.params.subcategoryname;
  Category.findOne({
    name: categoryName,
    subcategory: subcategoryName
  }, function(err, result) {
    if (err) {
      console.log(err);
      res.redirect('/category');
    } else {
      res.json(result);
    }
  });
  // var name1 = new Category({name:categoryName, subcategory: ['Men', 'Women' , 'Kids']});
  // name1.save();
});
module.exports = router;

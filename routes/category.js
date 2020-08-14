//jshint esversion:6

const express = require('express');
const router = express.Router();
const user = require('../model/user');
const Category = require('../model/category').CategoryModel;
const User = require('../model/user');


//Khaali required fields pass karo reduces compute time
router.get('/', function(req, res) {
  Category.find({},{_id:0},function(err, result) {
    res.send(result);
  });
});




//I FEEL NOT REQUIRED

//Khaali required fields pass karo reduces compute time
// router.get('/:categoryname', function(req, res) {
//   // res.send(req.params.categoryname);
//   categoryName = req.params.categoryname;
//   Category.findOne({
//     name: categoryName
//   }, function(err, result) {
//     if (err) {
//       console.log(err);
//       res.redirect('/category');
//     } else {
//       res.json(result);
//     }
//   });
//   // var name1 = new Category({name:categoryName});
//   // name1.save();
// });


//Khaali required fields pass karo reduces compute time
// router.get('/:categoryname/:subcategoryname', function(req, res) {
//   // res.send(req.params.categoryname);
//   categoryName = req.params.categoryname;
//   subcategoryName = req.params.subcategoryname;
//   Category.findOne({
//     name: categoryName,
//     subcategory: subcategoryName
//   }, function(err, result) {
//     if (err) {
//       console.log(err);
//       res.redirect('/category');
//     } else {
//       res.json(result);
//     }
//   });
//   // var name1 = new Category({name:categoryName, subcategory: ['Men', 'Women' , 'Kids']});
//   // name1.save();
// });


module.exports = router;

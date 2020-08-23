//jshint esversion:6

//DONE

const express = require('express');
const router = express.Router();
const Category = require('../model/category').CategoryModel;


// ajax route only
router.get('/', function(req, res) {
  Category.find({},{_id:0},function(err, result) {
    if(err){
      return res.send("Error getting data from mongo")
    }
    res.send(result);
  });
});


module.exports = router;

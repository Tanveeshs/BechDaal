//jshint esversion:6

//DONE

const express = require('express');
const router = express.Router();
const Category = require('../model/category').CategoryModel;

router.get('/', function(req, res) {
  Category.find({},{_id:0},function(err, result) {
    res.send(result);
  });
});


module.exports = router;

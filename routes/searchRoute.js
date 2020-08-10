//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const searchRouter = express.Router();
const Ads = require('../model/ad');
searchRouter.use(bodyParser.json());


// searchRouter.post('/search/:q' , function (req,res, next){
//   // console.log('in searchRoute!');
//   var q = req.params.q;
//   // console.log(q);
//      const regexp1 = new RegExp(`^${q}`, 'i')  // for finding it as beginning of the first word
//      const regexp2 = new RegExp(`\\s${q}`, 'i')  // for finding as beginning of a middle word
//   Ads.find({
//     $or:[{
//       title: {
//         $in: [regexp1, regexp2]
//       }},
//       {category: {
//         $in: [regexp1, regexp2]
//       }
//     }]
//
//   }, function (err , data ){
//     res.json(data);
//   }).limit(5);
// });
searchRouter.post('/main', function(req, res, next) {
  //console.log(req.body);
  var q = req.body.searchInput;
  const regexp1 = new RegExp(`^${q}`, 'i'); // for finding it as beginning of the first word
  const regexp2 = new RegExp(`\\s${q}`, 'i'); // for finding as beginning of a middle word
  var res1 = {
    data: [],
  };

  try {
    //Step 1: declare promise

    var myPromise = () => {
      return new Promise((resolve, reject) => {
//find in subcat
        Ads.find({
          sub_category: {
            $in: [regexp1, regexp2]
          }
        }, function(err, data) {
          if (data.length != 0) {
            data.forEach(item => {
              res1.data.push(item);
            });
          }
        });
    //find in title
    Ads.find({
      title: {
        $in: [regexp1, regexp2]
      }
    }, function(err, data) {
      if (data.length != 0) {
        data.forEach(item => {
          res1.data.push(item);
        });
      }
    });

    //find in brand
            Ads.find({
              brand: {
                $in: [regexp1, regexp2]
              }
            }, function(err, data) {
              if (data.length != 0) {
                data.forEach(item => {
                  res1.data.push(item);
                });
              }
            });
            
    //find in category
    Ads.find({
      category: {
        $in: [regexp1, regexp2]
      }
    }, function(err, data) {
      if (data.length != 0) {
        data.forEach(item => {
          res1.data.push(item);
        });
      }
    });
    //find in description
    Ads.find({
      description: {
        $in: [regexp1, regexp2]
      }
    }, function(err, data) {
      if (data.length != 0) {
        data.forEach(item => {
          res1.data.push(item);
        });
      }
      err
        ?
        reject(err) :
        resolve(res1);
    });



      });
    };

    //Step 2: async promise handler
    var callMyPromise = async () => {

      var result = await (myPromise());
      //anything here is executed after result is resolved
      return result;
    };

    //Step 3: make the call
    callMyPromise().then(function(result) {
      res.json(result);
    });

  } catch (e) {
    next(e)
  }
});

searchRouter.post('/search/:q', function(req, res, next) {
  var q = req.params.q;
  const regexp1 = new RegExp(`^${q}`, 'i'); // for finding it as beginning of the first word
  const regexp2 = new RegExp(`\\s${q}`, 'i'); // for finding as beginning of a middle word
  flag = 0;
  let res1 = {};

  try {
    //Step 1: declare promise

    var myPromise = () => {
      return new Promise((resolve, reject) => {
        flag = 0;
        if (flag == 0) {
          Ads.find({
            sub_category: {
              $in: [regexp1, regexp2]
            }
          }, function(err, data) {
            if (data.length != 0) {
              res1 = {
                Route: 1,
                data: data
              };

              flag = 1;

            }
            err
              ?
              reject(err) :
              resolve(res1);
          }).limit(5);
        }
        if (flag != 1) {
          flag = 0;
          Ads.find({
            brand: {
              $in: [regexp1, regexp2]
            }
          }, function(err, data) {
            if (data.length != 0) {
              res1 = {
                Route: 2,
                data: data
              };
            }
            err
              ?
              reject(err) :
              resolve(res1);
          }).limit(5);
        }


      });
    };

    //Step 2: async promise handler
    var callMyPromise = async () => {

      var result = await (myPromise());
      //anything here is executed after result is resolved
      return result;
    };

    //Step 3: make the call
    callMyPromise().then(function(result) {
      console.log(result)
      res.json(result);
    });

  } catch (e) {
    next(e)
  }

  //for searching in sub-category
  // if (flag == 0) {
  //   Ads.find({
  //     sub_category: {
  //       $in: [regexp1, regexp2]
  //     }
  //   }, function(err, data) {
  //     if (data.length != 0) {
  //       res1 = {
  //         Route: 1,
  //         data: data
  //       };
  //
  //       flag = 1;
  //
  //       res.json(res1);
  //     }
  //   }).limit(5);
  // }
  // if (flag != 1) {
  //   Ads.find({
  //     brand: {
  //       $in: [regexp1, regexp2]
  //     }
  //   }, function(err, data) {
  //     if (data.length != 0) {
  //       res1 = {
  //         Route: 2,
  //         data: data
  //       };
  //       flag = 2;
  //       res.json(res1);
  //     }
  //   }).limit(5);
  // }
  // if (flag != 1 && flag != 2) {
  //
  // }


});
module.exports = searchRouter;

//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const searchRouter = express.Router();
const Ads = require('../model/ad');
searchRouter.use(bodyParser.json());
const Category = require('../model/category')
const async = require('async')
//Sanitize Pehle
//Use async parallel

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
  if(req.body.isAjax==='1') {
    var q = req.body.searchInput;
    console.log(req.body)
    const regexp1 = new RegExp(`^${q}`, 'i'); // for finding it as beginning of the first word
    const regexp2 = new RegExp(`\\s${q}`, 'i'); // for finding as beginning of a middle word
    var query = {}
    query.$and = []
    if (typeof (req.body.searchInput) != 'undefined') {
      let orArray = [];
      orArray.push({
        sub_category: {
          $in: [regexp1, regexp2]
        }
      })
      orArray.push({
        title: {
          $in: [regexp1, regexp2]
        }
      });
      orArray.push({
        brand: {
          $in: [regexp1, regexp2]
        }
      });
      orArray.push({
        category: {
          $in: [regexp1, regexp2]
        }
      });
      orArray.push({
        description: {
          $in: [regexp1, regexp2]
        }
      });
      query.$and.push({$or: orArray})
    }
    if (typeof (req.body.locality) !== 'undefined') {
      query.$and.push({deliverableAreas: req.body.locality})
    }
    if (typeof (req.body.category) !== 'undefined') {
      query.$and.push({category: req.body.category})
    }
    if (typeof (req.body.sub_category) !== 'undefined') {
      query.$and.push({category: req.body.sub_category})

    }
    if (typeof (req.body.lower_price) !== 'undefined') {
      query.$and.push({price: {$gte: parseFloat(req.body.lower_price)}})
    }
    if (typeof (req.body.upper_price) !== 'undefined') {
      query.$and.push({price: {$lte: parseFloat(req.body.upper_price)}})
    }
    query.$and.push({approved: true})
    query.$and.push({isActive: true})
    query.$and.push({'rejected.val': false})
    //Low to high
    let page = 0 || req.body.page;
    if (parseInt(req.body.sorting) === 1) {

      Ads.find(query, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          if (req.body.isAjax === '1') {
            //Render the page
            console.log(result)
            res.json(result);
          } else {
            res.render('category.ejs', {
              body: req.body,
              ads: result
            })
          }
        }
      }).sort({price: 1}).limit(5).skip(5 * page)
    }
    //High To low
    if (parseInt(req.body.sorting) === 2) {
      Ads.find(query, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          if (req.body.isAjax === '1') {
            //Render the page
            res.json(result);
          } else {
            res.render('category.ejs', {
              ads: result
            })
          }
        }
      }).sort({price: -1}).limit(5).skip(5 * page)
    }
    //Most Recent
    if (parseInt(req.body.sorting) === 3) {
      Ads.find(query, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          if (req.body.isAjax === '1') {
            //Render the page
            res.json(result);
          } else {
            res.render('category.ejs', {
              ads: result
            })
          }
        }
      }).sort({date_posted: -1}).limit(5).skip(5 * page)
    }

  }else {
    return res.render('category.ejs',{
      body:req.body,
      user:req.user
    })

  }

});



searchRouter.post('/search/:q', (req, res) => {
  var q = req.params.q;
  const regexp1 = new RegExp(`^${q}`, 'i'); // for finding it as beginning of the first word
  const regexp2 = new RegExp(`\\s${q}`, 'i'); // for finding as beginning of a middle word
  async.parallel({
    getSubcategory: function(callback) {
      Ads.find({
        sub_category: {
          $in: [regexp1, regexp2]
        }
      }, {
        _id: 0,
        sub_category: 1
      }, function(err, cat) {
        if (err) {
          callback(err, null)
        }
        let arr = []
        cat.forEach(category => {
          arr.push(category.sub_category)
        })
        callback(null, arr)
      })
    },
    getTitle: function(callback) {
      Ads.find({
        title: {
          $in: [regexp1, regexp2]
        }
      }, {
        _id: 0,
        title: 1
      }, function(err, cat) {
        if (err) {
          callback(err, null)
        }
        let arr = []
        cat.forEach(category => {
          arr.push(category.title)
        })
        callback(null, arr)
      })
    }
  }, function(err, results) {
    if (err) {
      console.log(err)
      return res.send(err)
    }
    let result = []
    result.push(...results.getSubcategory)
    result.push(...results.getTitle)
    let uniq = [...new Set(result)]
    uniq = uniq.slice(0, 5)
    res.send(uniq)
  })


})

// searchRouter.post('/search/:q', function(req, res, next) {
//   var q = req.params.q;
//   const regexp1 = new RegExp(`^${q}`, 'i'); // for finding it as beginning of the first word
//   const regexp2 = new RegExp(`\\s${q}`, 'i'); // for finding as beginning of a middle word
//   flag = 0;
//   let res1 = [];
//
//   try {
//     //Step 1: declare promise
//
//     var myPromise = () => {
//       return new Promise((resolve, reject) => {
//         flag = 0;
//         if (flag == 0) {
//           Ads.find({
//             sub_category: {
//               $in: [regexp1, regexp2]
//             }
//           }, function(err, data) {
//             if (data.length != 0) {
//               for(var i =0 ; i<data.length;i++){
//                 res1.push(data.sub_category);
//               }
//
//               flag = 1;
//
//             }
//             err
//               ?
//               reject(err) :
//               resolve(res1);
//           }).limit(10);
//         }
//         // if (flag != 1) {
//         //   flag = 0;
//         //   Ads.find({
//         //     brand: {
//         //       $in: [regexp1, regexp2]
//         //     }
//         //   }, function(err, data) {
//         //     if (data.length != 0) {
//         //       res1 = {
//         //         Route: 2,
//         //         data: data
//         //       };
//         //     }
//         //     err
//         //       ?
//         //       reject(err) :
//         //       resolve(res1);
//         //   }).limit(5);
//         // }
//
//
//       });
//     };
//
//     //Step 2: async promise handler
//     var callMyPromise = async () => {
//
//       var result = await (myPromise());
//       //anything here is executed after result is resolved
//       return result;
//     };
//
//     //Step 3: make the call
//     callMyPromise().then(function(result) {
//       console.log(result)
//       res.send(result);
//     });
//
//   } catch (e) {
//     next(e)
//   }
//
//
//   //for searching in sub-category
//   // if (flag == 0) {
//   //   Ads.find({
//   //     sub_category: {
//   //       $in: [regexp1, regexp2]
//   //     }
//   //   }, function(err, data) {
//   //     if (data.length != 0) {
//   //       res1 = {
//   //         Route: 1,
//   //         data: data
//   //       };
//   //
//   //       flag = 1;
//   //
//   //       res.json(res1);
//   //     }
//   //   }).limit(5);
//   // }
//   // if (flag != 1) {
//   //   Ads.find({
//   //     brand: {
//   //       $in: [regexp1, regexp2]
//   //     }
//   //   }, function(err, data) {
//   //     if (data.length != 0) {
//   //       res1 = {
//   //         Route: 2,
//   //         data: data
//   //       };
//   //       flag = 2;
//   //       res.json(res1);
//   //     }
//   //   }).limit(5);
//   // }
//   // if (flag != 1 && flag != 2) {
//   //
//   // }
//
//
// });


searchRouter.post('/searchByCat', (req, res) => {
  const categoryId = req.body.categoryId;
  Category.CategoryModel.findOne({
    _id: categoryId
  }, {
    _id: 0,
    name: 1,
    subcategory: 0,
    image: 0
  }, function(err, cat) {
    Ads.find({
      category: cat.name,
      approved: true,
      'rejected.val': false,
      isActive: true
    }, function(err, ads) {
      res.render('category.ejs', {
        ads: ads
      })
    })
  })
})

module.exports = searchRouter;

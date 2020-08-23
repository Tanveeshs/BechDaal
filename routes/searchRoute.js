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

searchRouter.post('/search/:q',(req,res)=>{
  var q = req.params.q;
  const regexp1 = new RegExp(`^${q}`, 'i'); // for finding it as beginning of the first word
  const regexp2 = new RegExp(`\\s${q}`, 'i'); // for finding as beginning of a middle word
  async.parallel({
    getSubcategory:function (callback){
      Ads.find({
          sub_category: {$in: [regexp1, regexp2]}
      },
        {_id:0,sub_category:1},function (err,cat){
        if(err){
          callback(err,null)
        }
        let arr=[]
        cat.forEach(category=>{
          arr.push(category.sub_category)
        })
        callback(null,arr)
      })
    },
    getTitle:function (callback) {
      Ads.find({title: {$in: [regexp1, regexp2]}},{_id:0,title:1},function (err,cat){
        if(err){
          callback(err,null)
        }
        let arr=[]
        cat.forEach(category=>{
          arr.push(category.title)
        })
        callback(null,arr)
      })
    }
  },function (err,results){
    if(err){
      console.log(err)
      return res.send(err)
    }
    let result= []
    result.push(...results.getSubcategory)
    result.push(...results.getTitle)
    let uniq = [...new Set(result)]
    if(uniq.length<10){
      uniq = uniq.slice(0,uniq.length)
    }
    else {
      uniq = uniq.slice(0,10)
    }
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


searchRouter.post('/searchByCat',(req,res)=>{
  const categoryId = req.body.categoryId;
  Category.CategoryModel.findOne({_id:categoryId},{_id:0,name:1,subcategory:0,image:0},function (err,cat){
    Ads.find({category:cat.name,approved:true,'rejected.val':false,isActive:true},function (err,ads){
      res.render('category.ejs',{ads:ads})
    })
  })
})

module.exports = searchRouter;

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

searchRouter.post('/search/:q' , function (req,res, next){
  var q = req.params.q;
    const regexp1 = new RegExp(`^${q}`, 'i')  // for finding it as beginning of the first word
    const regexp2 = new RegExp(`\\s${q}`, 'i')  // for finding as beginning of a middle word
    flag=0;
    //for searching in sub-category
    if(flag==0){
      Ads.find(
          {sub_category: {
            $in: [regexp1, regexp2]
          }
      }, function (err , data ){
        let res1 = {
          Route:1,
          data:data
        }
        if(data){
        flag=1;
        }
        res.json(res1);
      }).limit(5);
    }
else if(flag!=1){
    Ads.find(
        {brand: {
          $in: [regexp1, regexp2]
        }
    }, function (err , data ){
      let res1 = {
        Route:2,
        data:data
      }
      flag=2;
      res.json(res1);
    }).limit(5);
  }


});
module.exports = searchRouter;

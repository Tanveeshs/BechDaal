const express = require('express');
const bodyParser = require('body-parser');
const searchRouter = express.Router();
const Ads = require('../model/ad');
searchRouter.use(bodyParser.json());

// searchRouter.route('/:qrystr')
// .get((req, res) => {
//   const a = req.params.qrystr;
//   const regexp1 = new RegExp(`^${a}`, 'i')  // for finding it as beginning of the first word
//   const regexp2 = new RegExp(`\\s${a}`, 'i')  // for finding as beginning of a middle word
//   Ads.find({
//     title: {
//       $in: [regexp1, regexp2]
//     }
//   })
//   .then((result) => {
//     console.log(result);
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json(result);
//   })
//   .catch((err) => console.log(err));
// })

searchRouter.post('/search/:q' , function (req,res, next){
  console.log('in searchRoute!');
  var q = req.params.q;
  console.log(q);
     const regexp1 = new RegExp(`^${q}`, 'i')  // for finding it as beginning of the first word
     const regexp2 = new RegExp(`\\s${q}`, 'i')  // for finding as beginning of a middle word
  Ads.find({
    title: {
      $in: [regexp1, regexp2]
    }
  }, function (err , data ){
    res.json(data);
  }).limit(10);
});

module.exports = searchRouter;
